# Implementation Plan - Fuenzer Sports

This document outlines the step-by-step execution plan for the development phase after the initial commit. The steps are ordered logically to ensure incremental progress and allow for testing at each stage.

| Status | Phase | Step | Tasks |
|:---:|---|---|---|
| [x] | **1. Core Foundation** | **1. Frontend Base Setup** | • Install Tailwind CSS, Zustand, Framer Motion.<br>• Create global styles (`index.css`) for Strict Dark Mode.<br>• Build `Navbar` and `Footer` components. |
| [x] | **1. Core Foundation** | **2. Landing Page UI** | • Build `LandingPage.tsx`.<br>• Create Stitch-style `Hero Search Box` with Model/Mode selectors.<br>• Add `Quick Action Chips`.<br>• Implement "Below the Fold" sections (Statistics, Features, Benefits, FAQ). |
| [x] | **2. Backend Logic** | **3. External Data** | • Implement `integrations/football_data.py` to fetch from `football-data.org`.<br>• Create mock data handlers for local development. |
| [x] | **2. Backend Logic** | **4. Monte Carlo Engine** | • Develop simulation logic in `services/`.<br>• Implement 48-team, 12-group World Cup 2026 rules.<br>• Optimize using vectorized `NumPy` operations. |
| [x] | **2. Backend Logic** | **5. FastAPI Endpoints** | • Define Pydantic models.<br>• Build `POST /simulate` endpoint in `api/simulate.py` to process prompts and return JSON results. |
| [x] | **2. Backend Logic** | **6. Backend Testing** | • Install `pytest`, `pytest-asyncio`, `pytest-cov`.<br>• Setup `backend/tests/` structure.<br>• Write tests for external integrations and APIs. |
| [x] | **3. Integration** | **7. State & API Hookup** | • Configure `Zustand` (persist middleware) for Guest Mode `localStorage`.<br>• Connect Frontend search to Backend `/simulate` API. |
| [x] | **3. Integration** | **8. Playground UI** | • Build split-view `Playground.tsx`.<br>• Create Left Panel: AI Chat.<br>• Create Right Panel: `StandingsTable`.<br>• **Crucial:** Add `Framer Motion` layout animations for smooth row transitions. |
| [ ] | **3. Integration** | **8.5 LLM Integration** | • Integrate OpenRouter for development (fallback to Fireworks AI on AMD Cloud for prod).<br>• Setup OpenAI client compatible with both providers. |
| [ ] | **3. Integration** | **8.6 Data Source Strategy** | • Use local `football_data_standings.json` for Group Stages (static).<br>• Fetch from `football-data.org` API only for Knockout stages to save rate limits. |
| [x] | **4. Polish** | **9. UI/UX Refinement** | • Apply semantic colors for probabilities (Green/Yellow/Red).<br>• Enforce `JetBrains Mono` font for all numbers.<br>• Test Landing Page to Playground smooth transition. |
| [ ] | **4. Polish** | **9.5 Error Handling UI** | • Implement custom-designed error toasts/banners (English, friendly to non-technical users).<br>• Catch API timeouts in `useAppStore` and display them visually (no browser default alerts). |
| [ ] | **4. Polish** | **10. Final Review & Demo** | • Record Video Demo / GIF of the platform.<br>• Update `README.md` if setup steps changed.<br>• Final repository check for Hackathon submission. |
| [ ] | **5. Post-MVP Enhancements** | **11. Auth & Firestore** | • Setup Firebase Auth (Google Sign-In).<br>• Sync `localStorage` history to Firestore for cloud backup. |
| [ ] | **5. Post-MVP Enhancements** | **12. SEO & Security Check** | • Implement SEO tags in `public` folder.<br>• Perform frontend and API security checks. |

*Note: Mark the `Status` column with `[x]` as each step is completed.*

### Verification Note:
To verify the frontend build and check for any TypeScript compilation errors or warnings, run:
```bash
cd frontend
npx tsc -b
```

To run the backend test suite, use:
```bash
cd backend
pytest --cov=app tests/
```
