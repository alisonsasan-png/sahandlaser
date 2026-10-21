"""Describe the isolated preview package; stdout can read one file for a connector."""
from pathlib import Path
import json,hashlib,base64,sys
HERE=Path(__file__).resolve().parent
if len(sys.argv)==4 and sys.argv[1]=='--read-chunk':
    path=(HERE/sys.argv[2]).resolve()
    assert path.is_relative_to(HERE) and path.is_file()
    data=path.read_bytes()
    binary=path.suffix.lower() in {'.jpg','.png','.jpeg','.webp','.gif','.ttf'}
    content=base64.b64encode(data).decode() if binary else data.decode('utf-8-sig')
    offset=int(sys.argv[3])
    print(json.dumps({'content':content[offset:offset+24000],'encoding':'base64' if binary else 'utf-8','totalLength':len(content)},ensure_ascii=True))
    sys.exit()
if len(sys.argv)==3 and sys.argv[1]=='--read':
    path=(HERE/sys.argv[2]).resolve()
    assert path.is_relative_to(HERE) and path.is_file()
    data=path.read_bytes()
    binary=path.suffix.lower() in {'.jpg','.png','.jpeg','.webp','.gif','.ttf'}
    print(json.dumps({'content':base64.b64encode(data).decode() if binary else data.decode('utf-8-sig'),'encoding':'base64' if binary else 'utf-8'},ensure_ascii=True))
    sys.exit()
from dulwich.repo import Repo
from dulwich.objects import Blob
active={m['src'] for m in json.loads((HERE/'image-matches.json').read_text(encoding='utf-8'))}
files=[]
with Repo(str(HERE.parent)) as repo:
    for path in sorted(HERE.rglob('*')):
        if not path.is_file():continue
        rel=path.relative_to(HERE).as_posix()
        if rel in {'package-manifest.json','bootstrap_snapshot.py','REVIEW.md'} or '__pycache__' in path.parts:continue
        if rel.startswith('media/') and rel not in active:continue
        if rel.startswith('checks/') and path.suffix!='.json':continue
        data=path.read_bytes()
        sha=Blob.from_string(data).id
        files.append({'path':'preview-51/'+rel,'relativePath':rel,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'gitBlobSha':sha.decode(),'existingGitBlob':sha in repo.object_store,'binary':path.suffix.lower() in {'.jpg','.png','.jpeg','.webp','.gif','.ttf'}})
manifest={'base':'1f597a8de835bd43e65d1efe136e161056202129','branch':'preview-51-catalog','scope':'preview-51/ only','files':files}
(HERE/'package-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'files':len(files)+1,'bytes':sum(f['bytes'] for f in files),'newBinaryBlobs':sum(f['binary'] and not f['existingGitBlob'] for f in files)}))
