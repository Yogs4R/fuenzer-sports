# Security Policy

The **Fuenzer Sports** team takes the security of our platform and user data seriously. This document outlines our security policies and procedures for reporting potential vulnerabilities.

---

## 🛡️ Supported Versions

We actively maintain and provide security patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| `main` (Latest) | :white_check_mark: |
| `< 1.0` | :x:                |

---

## 🚨 Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability within Fuenzer Sports, please report it privately:

* **Email:** [ridwansuryantara@gmail.com](mailto:ridwansuryantara@gmail.com)
* **Subject line:** `[SECURITY] Potential Vulnerability in Fuenzer Sports`

### What to Include in Your Report
To help us triage and resolve the issue quickly, please provide:
1. A clear description of the vulnerability.
2. Step-by-step instructions or a minimal Proof of Concept (PoC) to reproduce the issue.
3. The potential impact of the vulnerability.
4. Any potential mitigations or remediations you have identified.

### Response & Disclosure Process
* **Initial Response:** We will acknowledge receipt of your vulnerability report within **48 hours**.
* **Assessment & Fix:** We will evaluate the report, verify the issue, and work on a security patch.
* **Coordination:** We request that you follow responsible disclosure guidelines and keep details confidential until a fix has been deployed.
* **Credit:** We will publicly credit your contribution in our release notes (if you wish to be credited).

---

## 🔒 Security Practices in Place

Fuenzer Sports implements automated continuous security checks via GitHub Actions:
* **Secret Scanning (Gitleaks):** Scans git commits to prevent accidental credential and API token leaks.
* **Container Vulnerability Scanning (Trivy):** Scans production container images for known OS and library CVEs.
* **Automated Dependency Auditing (Dependabot):** Automatically monitors and alerts on third-party package vulnerabilities.
