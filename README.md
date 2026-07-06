# Fuenzer Sports | AI-Driven Tournament Simulator

![Fuenzer Sports Banner](docs/assets/banner.png)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![AMD ROCm](https://img.shields.io/badge/AMD_ROCm-ED1C24?style=for-the-badge&logo=amd&logoColor=white)

## Description
Fuenzer Sports is an interactive AI-driven sports analytics simulation platform. It functions as a hybrid between an instant search interface and a sports management game. Ask any question regarding a tournament, and our engine runs thousands of Monte Carlo simulations in seconds, presenting the results in an interactive animated standings table with smart commentary.

## Setup and Usage Instructions

### Backend (Python/FastAPI)
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `uvicorn app.main:app --reload`

### Frontend (React/Vite)
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Docker (Production / Judging)
To spin up the entire stack using Docker Compose:
```bash
docker-compose up --build
```

---

## AMD Hackathon Act 2 Criteria

### Creativity and Originality
The uniqueness and creativity of the solution, highlighting novel approaches and new behaviors. By treating sports predictions not as static dashboards but as interactive "Search-to-Workspace" AI chats, Fuenzer Sports offers a novel Zero-Friction approach to sports analytics.

### Product/Market Potential
The startup or product vision — how compelling and viable the idea is in a real market context. Fuenzer targets both professional analysts and hardcore fans who desire instant, data-backed answers during major sporting events like the 2026 World Cup.

### Completeness
How fully realized and functional the submitted project is. The MVP implements full end-to-end flow from user prompt, stateless FastAPI simulation, to animated frontend standings rendering.

### Use of AMD Platforms
How meaningfully AMD infrastructure is incorporated into the project. The heavy mathematical computations for Monte Carlo simulations are highly parallelized and optimized to run on AMD ROCm instances, ensuring low-latency results even for 10,000+ simulation scenarios per prompt.
