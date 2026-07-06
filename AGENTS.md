# AI Agent Guidelines (BMAD) - Fuenzer Sports

This is the configuration file or ground rules (User Rules) for any AI agent contributing to the code development (frontend/backend) of this project.

## General Rules
- This project uses a **Monorepo** architecture with the backend in `backend/` and frontend in `frontend/`.
- Do not randomly modify the architecture configuration files (`ARCHITECTURE.md`) and design specifications (`DESIGN.md`) without user approval.
- Ensure that the code you write prioritizes performance (especially in the computational backend) and memory efficiency (storing state in LocalStorage on the frontend).

## Frontend Rules (React / Vite)
- **Mandatory Technologies:** React 18, TypeScript, Tailwind CSS, Zustand, Framer Motion.
- **Strict Styling:** ALWAYS refer to `DESIGN.md` for color selection. Apply "Strict Dark Mode".
- **Fonts:** You must always use "Inter" for main text and "JetBrains Mono" specifically for displaying match scores, percentages, and standings points.
- **Animations:** When handling rows in the standings table, add the `layout` prop from Framer Motion to produce a *smooth transition* when the Monte Carlo algorithm changes the team order.

## Backend Rules (Python / FastAPI)
- **Mandatory Technologies:** Python 3.10+, FastAPI, Pydantic, NumPy.
- **State Management:** This backend is designed to be **STATELESS**. Do not store *chat* sessions in backend server variables or local server memory. The *chat history* data is managed by the client (frontend) and sent back along with the *prompt*.
- **Numerical Performance:** Use vectorized operations via `NumPy` to perform thousands of Monte Carlo calculations for fast execution on compute machines (AMD ROCm).
- **External Data:** Use the `football-data.org` API to fetch fixtures and team data. Do not use static seed data files.
