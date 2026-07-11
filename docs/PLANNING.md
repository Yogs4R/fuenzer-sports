# Fuenzer Sports - Feature Planning & Roadmap (Hackathon Track 3)

This document contains the list of ideas and feature priorities resulting from the roundtable discussion (Agent & User) to improve the chances of winning the AMD Developer Hackathon Act 2 (Track 3: Unicorn / Open Innovation).

## 1. Custom Tournament Builder (Priority: HIGH) (DONE)
**Goal:** Expand product-market fit from a simple "World Cup Simulator" to a "Universal Tournament Simulator" for schools, campuses, eSports leagues, and local amateur tournaments.

**UX & UI Details:**
- **Dropdown & Slash Command Trigger:** Add a `Custom` option inside the *Competition* dropdown in `HeroSearchBox.tsx`. Provide a `/custom` slash command shortcut in the text input box.
- **Dynamic Dropdown:** When `Custom` is selected, hide the *Mode* dropdown (Live Standings / From Scratch) since custom tournaments are inherently built from scratch.
- **Generative UI:** Instead of relying on static 8-group templates, the frontend will dynamically render UI components based on the structured JSON output (e.g. creating 4 groups, 3 groups, etc.) returned by the AI.
- **Landing Page Update:** Update copywriting in `LandingPage.tsx` and `BelowTheFold.tsx` so new users immediately know the simulator supports custom tournaments.

**Backend & AI Details:**
- The AI will act as a *Tournament Director* that autonomously structures the group size and knockout stages based on the user's natural language input.
- The Monte Carlo Engine will run simulation iterations using AI-generated (or user-adjusted) base Elo ratings, maintaining high-speed parallel computation on AMD ROCm.

---

## 2. Dynamic What-If Scenarios & Human-in-the-Loop (Priority: HIGH) (DONE)
**Goal:** Demonstrate the AI Agent's capability to modify environment states in real-time and handle LLM knowledge gaps elegantly without hallucinating.

**Scenario "Retired Players / Debuting Players (e.g., Asep)":**
- When a user asks a question like *"What if Asep gets injured?"*, the AI checks if it can map Asep to a specific team based on pre-trained knowledge.
- **Human-in-the-Loop (HITL) UX:** If the AI does not recognize the player (e.g., a newly debuted player, or a fictional/school team player), the AI will NOT hallucinate. Instead, it returns a `needs_clarification` JSON event.
- The frontend will intercept this event and render an interactive form/menu within the chat panel (Left Panel).
- The form will ask: *"I don't recognize the player 'Asep'. Which team does Asep play for?"* along with a dropdown list of current teams.
- Once confirmed, the data is sent back to the AI Agent. The Agent then applies the modifier (e.g. -15% strength) to the target team and re-triggers the Monte Carlo GPU computation.

---

## 3. Agentic Tool Calling (Priority: MEDIUM-HIGH) (DONE)
**Goal:** Upgrade backend architecture from simple *If-Else Routing* to a *True Autonomous AI Agent* (Level 7+).

**Implementation Details:**
- Refactor the backend architecture so that the LLM (Fireworks AI) is natively registered with specific functions (Tools).
- The LLM will autonomously decide (*Reasoning*) when to call `run_monte_carlo()`, `fetch_live_api()`, or `ask_user_for_clarification()` based on user intent.
- This creates a reactive, flexible, and truly intelligent backend orchestration layer.
