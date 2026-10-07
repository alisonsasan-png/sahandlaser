"""Upload one verified image bundle with explicit TLS; never delete remote files."""
import ftplib
import hashlib
import io
import os
import re
import ssl
import base64
import stat
import urllib.parse
import urllib.request
import zipfile

LIMIT = 100 * 1024 * 1024
ALLOWED = {'.webp', '.png', '.jpg', '.jpeg', '.glb'}

def unpack(data, expected):
    if len(data) > LIMIT or not re.fullmatch(r'[a-fA-F0-9]{64}', expected):
        raise ValueError('Invalid bundle size or SHA-256')
    if hashlib.sha256(data).hexdigest() != expected.lower():
        raise ValueError('Bundle SHA-256 mismatch')
    result = {}
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        if len(z.infolist()) > 200:
            raise ValueError('Too many entries')
        total = 0
        for item in z.infolist():
            name = item.filename
            if item.is_dir():
                continue
            parts = name.split('/')
            if len(parts) > 6 or any(not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]{0,127}', p) for p in parts):
                raise ValueError('Invalid filename')
            if name.rsplit('.', 1)[-1].lower() not in {x[1:] for x in ALLOWED}:
                raise ValueError('Unsupported media type')
            normal = '/'.join(parts)
            if stat.S_ISLNK(item.external_attr >> 16) or normal.lower() in result:
                raise ValueError('Symlink or duplicate filename')
            total += item.file_size
            if total > LIMIT:
                raise ValueError('Expanded bundle too large')
            result[normal.lower()] = (normal, z.read(item))
    if not result:
        raise ValueError('Empty bundle')
    return list(result.values())

def ensure_remote_dir(ftp, path):
    start = ftp.pwd()
    try:
        for part in path.split('/'):
            if not part:
                continue
            try:
                ftp.cwd(part)
            except ftplib.error_perm as error:
                if not str(error).startswith('550'):
                    raise
                ftp.mkd(part)
                ftp.cwd(part)
    finally:
        ftp.cwd(start)

class HTTPSOnly(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if urllib.parse.urlsplit(newurl).scheme != 'https':
            raise ValueError('HTTPS required')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def read_url(url):
    parts = urllib.parse.urlsplit(url)
    if parts.scheme != 'https' or parts.username or parts.password or not parts.hostname:
        raise ValueError('HTTPS URL required')
    opener = urllib.request.build_opener(HTTPSOnly())
    with opener.open(url, timeout=60) as response:
        data = response.read(LIMIT + 1)
    if len(data) > LIMIT:
        raise ValueError('Download too large')
    return data

def read_github_blob(repo, sha):
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repo or ''):
        raise ValueError('Invalid GitHub repository')
    if not re.fullmatch(r'[a-fA-F0-9]{40}', sha or ''):
        raise ValueError('Invalid Git blob SHA')
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        raise ValueError('GitHub token required')
    url = 'https://api.github.com/repos/' + repo + '/git/blobs/' + sha
    request = urllib.request.Request(
        url,
        headers={
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = response.read(LIMIT + 1024)
    if len(payload) > LIMIT + 1024:
        raise ValueError('Blob response too large')
    import json
    body = json.loads(payload.decode('utf-8'))
    if body.get('encoding') != 'base64' or not isinstance(body.get('content'), str):
        raise ValueError('Unexpected blob encoding')
    data = base64.b64decode(body['content'], validate=False)
    if len(data) > LIMIT:
        raise ValueError('Blob too large')
    return data

def main():
    required = ['MEDIA_FTP_HOST', 'MEDIA_FTP_USER', 'MEDIA_FTP_PASSWORD',
                'MEDIA_FTP_DIRECTORY', 'MEDIA_PUBLIC_BASE_URL', 'BUNDLE_SHA256']
    if any(not os.environ.get(k) for k in required):
        raise ValueError('Configure all media connection secrets first')
    if os.environ.get('BUNDLE_BLOB_SHA'):
        data = read_github_blob(os.environ['GITHUB_REPOSITORY'], os.environ['BUNDLE_BLOB_SHA'])
    elif os.environ.get('BUNDLE_URL'):
        data = read_url(os.environ['BUNDLE_URL'])
    else:
        raise ValueError('Bundle source required')
    files = unpack(data, os.environ['BUNDLE_SHA256'])
    host = os.environ['MEDIA_FTP_HOST']
    if not re.fullmatch(r'[A-Za-z0-9.-]+', host):
        raise ValueError('FTP host must be a hostname, not a URL')
    target = os.environ['MEDIA_FTP_DIRECTORY']
    if not target or '..' in target.split('/'):
        raise ValueError('Invalid media directory')
    public = os.environ['MEDIA_PUBLIC_BASE_URL'].rstrip('/')
    if urllib.parse.urlsplit(public).scheme != 'https':
        raise ValueError('Public media URL must use HTTPS')
    uploaded = skipped = 0
    with ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=60) as ftp:
        ftp.connect(host, 21)
        ftp.login(os.environ['MEDIA_FTP_USER'], os.environ['MEDIA_FTP_PASSWORD'])
        ftp.prot_p()
        # Base directory must already exist; product/media subdirectories are created below it.
        ftp.cwd(target)
        base_dir = ftp.pwd()
        for name, data in files:
            directory, filename = name.rsplit('/', 1) if '/' in name else ('', name)
            if directory:
                ensure_remote_dir(ftp, directory)
                ftp.cwd(directory)
            existing = hashlib.sha256()
            try:
                ftp.retrbinary('RETR ' + filename, existing.update)
                same = existing.hexdigest() == hashlib.sha256(data).hexdigest()
            except ftplib.error_perm as error:
                if not str(error).startswith('550'):
                    raise
                same = False
            if same:
                skipped += 1
            else:
                ftp.storbinary('STOR ' + filename, io.BytesIO(data))
                uploaded += 1
            if directory:
                ftp.cwd(base_dir)
            served_path = '/'.join(urllib.parse.quote(p) for p in name.split('/'))
            served = read_url(public + '/' + served_path)
            if hashlib.sha256(served).digest() != hashlib.sha256(data).digest():
                raise ValueError('Public verification failed for ' + name)
    print(f'Verified {len(files)} media files; uploaded {uploaded}; unchanged {skipped}.')

if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        # Never expose signed download URLs, FTP usernames, or credential-bearing errors.
        print('Media upload failed. Safe error: ' + error.__class__.__name__ + ': ' + str(error))
        raise SystemExit(1)
