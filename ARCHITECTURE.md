# System Architecture - Fuenzer Sports

This MVP architecture is optimized for data computation performance and seamless AI integration, utilizing local storage (*client-side*) for initial interactions to maximize "Time-to-Value".

## Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Zustand (with Persist Middleware for LocalStorage).
- **Backend:** Python (FastAPI, Pydantic, NumPy) - Serves as the Monte Carlo simulation engine & AI Gateway.
- **External APIs:** Football-Data.org API (currently not used; the system relies on local JSON datasets like `football_data_standings.json` for all tournament stages. A backend caching layer like in-memory or Redis will be implemented to bypass the 10/min rate limit when external API data integration is active).
- **Database & Auth:** Firebase (Firestore & Google Auth) - Active during profile/login synchronization.
- **AI Infrastructure:** AMD ROCm (Local/Fast) & Fireworks AI API (Pro).
- **Deployment:** Cloudflare Pages (Frontend) & AMD Developer Cloud (Backend Docker).

## Storage Flow Diagram
```
[ User Action (Send Prompt) ]
        │
        ▼
[ FastAPI Backend processes Simulation & AI ]
        │
        ▼ (Returns JSON)
[ React Frontend receives Results ]
        │
        ├── If Status = GUEST ──> [ Save to LocalStorage ]
        │
        └── If Status = LOGIN ──> [ Save to LocalStorage & Sync to Firestore ]
```

## Project Structure (Monorepo)
```
fuenzer-sports/
├── backend/                    # PYTHON FASTAPI (API & Simulation Engine)
│   ├── app/               
│   │   ├── api/                # API Endpoints (routes)
│   │   │   └── simulate.py     # Router for POST /simulate
│   │   ├── core/               # System config (CORS, Load ENV, API Keys)
│   ├── data/               # Parsed JSON datasets (Elo Ratings, Market Values) for simulation
│   ├── data_pipeline/      # Raw data sources (.md, .csv) and parsing scripts
│   ├── integrations/       # External API Clients
│   │   │   └── football_data.py# Client for football-data.org API
│   │   ├── models/             # Pydantic schemas (JSON payload validation)
│   │   ├── services/           # Business logic (NumPy Monte Carlo, AI Routing)
│   │   └── main.py             # FastAPI Entry point
│   ├── requirements.txt        # Library list (fastapi, uvicorn, numpy, requests, etc)
│   └── Dockerfile              # Python Dockerfile
│
├── frontend/                   # REACT FRONTEND (UI & Visualization)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Navbar, Footer, Split-pane layout
│   │   │   ├── search/         # Hero Chat Box (Stitch style)
│   │   │   └── playground/     # Standings Table, Probability Cards
│   │   ├── pages/              # Main view pages
│   │   │   ├── LandingPage.tsx # The Input Phase
│   │   │   └── Playground.tsx  # The Workspace (AI Chat + Visuals)
│   │   ├── store/              # Zustand state management
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # React DOM render entry
│   ├── Dockerfile              # Frontend Dockerfile (Nginx Alpine)
│   └── package.json            # Node dependencies
│
├── docker-compose.yml          # ORCHESTRATION for Hackathon Judges
└── README.md                   # Project overview and setup instructions
```
