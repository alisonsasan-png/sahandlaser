# Security Policy

## Supported version
The actively maintained version of Sahand Laser is the current `main` branch and the version deployed through GitHub Pages.

## Reporting a vulnerability
Please do **not** publish exploitable security details in a public GitHub Issue.

If you discover a vulnerability, report it privately to the Sahand Laser maintainers through the private contact channel already used by the project team. Include:
- affected page/file/component;
- steps to reproduce;
- expected vs. actual behavior;
- impact;
- screenshots or proof-of-concept when safe;
- suggested remediation, if known.

Do not include passwords, API keys, customer data, personal data, or other secrets in reports.

## Response process
Reports are triaged by the Project Lead / Security role. A confirmed issue is assigned for remediation, then passes QA and Reality Check before deployment.

Target handling:
- Critical: immediate triage; deploy a verified fix as soon as practical.
- High: priority remediation.
- Medium/Low: scheduled with normal maintenance.

## Project security rules
- Never commit passwords, tokens, API keys, private keys, SFTP/FTP credentials, or customer data.
- Use least-privilege OAuth/app permissions and repository secrets for automation.
- Production changes must pass the project's QA and Reality Check gates.
- Unverified third-party scripts, downloads, 3D assets, and technical data must not be promoted to production.
- The existing WordPress installation at sahandlaser.com is outside this repository and must not be modified by repository automation.
- Security fixes should be minimal and preservation-first; unrelated redesigns must not be bundled into a security patch.

## Scope
This policy covers the Sahand Laser static website repository, its GitHub Actions, GitHub Pages deployment, and repository-managed assets/configuration. Third-party platforms and the separate WordPress installation are governed by their own security policies.

## Disclosure
Please allow the maintainers reasonable time to investigate and deploy a fix before public disclosure.
