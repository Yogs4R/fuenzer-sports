# Contributing to Fuenzer Sports

Thank you for your interest in contributing to **Fuenzer Sports**! We welcome community contributions, bug fixes, feature proposals, and documentation enhancements.

Please take a moment to review this document before submitting your contribution.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [ridwansuryantara@gmail.com](mailto:ridwansuryantara@gmail.com).

---

## 🛠️ Development Setup

Fuenzer Sports is organized as a decoupled monorepo:
* `frontend/`: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Zustand.
* `backend/`: FastAPI, Python 3.10+, NumPy (Monte Carlo engine), Pytest.

### 1. Prerequisites
* Node.js 18+ and npm
* Python 3.10+
* Git
* (Optional) Docker & Docker Compose

### 2. Fork & Clone
```bash
git clone https://github.com/Yogs4R/fuenzer-sports.git
cd fuenzer-sports
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔀 Branching Strategy & Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. **Make your changes:**
   * Write clean, readable, and typed code.
   * Add automated tests for new functionality where applicable.
3. **Run local tests & linters:**
   * **Backend:**
     ```bash
     cd backend
     pytest tests/
     ```
   * **Frontend:**
     ```bash
     cd frontend
     npm run lint # or oxlint
     npm run build
     ```
4. **Commit with Conventional Commits:**
   We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   * `feat: add new tournament simulation metric`
   * `fix: handle edge case in tiebreaker resolution`
   * `docs: update deployment guidelines`
   * `refactor: optimize NumPy vectorized score generation`
   * `chore: update dependencies`

---

## 🚀 Submitting a Pull Request (PR)

1. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of `Yogs4R/fuenzer-sports`.
3. Provide a clear PR title and description outlining:
   * What problem this PR solves.
   * Key changes made.
   * Any testing or visual proof (e.g. screenshots for UI updates).
4. Ensure all GitHub Actions CI checks (Gitleaks secret scan, Trivy container security scan, builds) pass.

---

## 💡 Reporting Bugs & Requesting Features

* **Bug Reports:** Open an issue describing the expected vs actual behavior, steps to reproduce, and environment details.
* **Feature Requests:** Open an issue explaining the motivation, use case, and proposed implementation idea.

Thank you for helping make Fuenzer Sports better! ⚽🏆
