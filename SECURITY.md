# Security Policy

## Supported Versions

This project is a static website and we maintain security for the following:

| Component | Version | Supported          |
| --------- | ------- | ------------------ |
| Website   | Latest  | :white_check_mark: |
| Dependencies | Latest | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in our Aurora Zone website, please help us by reporting it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to the maintainer with details about the vulnerability
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
- **Investigation**: We'll investigate and validate the report within 7 days
- **Resolution**: We'll work to resolve valid security issues as quickly as possible
- **Credit**: We'll give you credit for the discovery (if you wish)

### Security Best Practices

This website follows these security practices:

- **HTTPS Only**: All connections should use HTTPS
- **Content Security Policy**: Implemented to prevent XSS attacks
- **No Sensitive Data**: We don't store or process sensitive user data
- **Regular Updates**: Dependencies and code are regularly reviewed
- **Input Validation**: All user inputs are properly validated and sanitized

### Scope

Security reports are welcomed for:
- Cross-site scripting (XSS)
- Content injection
- Authentication/authorization flaws
- Configuration issues
- Dependency vulnerabilities

### Out of Scope

- Issues in third-party services (Dawn, GitHub Pages)
- Social engineering attacks
- Physical attacks
- Denial of service attacks
- Issues that require physical access to user devices

## Security Contact

For security-related questions or to report vulnerabilities, please contact:
- GitHub: [@TurboRx](https://github.com/TurboRx)
- Create a private security advisory on this repository

Thank you for helping keep Aurora Zone safe!
