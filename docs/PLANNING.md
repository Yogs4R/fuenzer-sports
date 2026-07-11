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

---

## 4. Step-by-Step Interactive Simulation (Backlog / Future Idea)
**Goal:** Maintain both **"Direct Mode"** (One-click jump to final results) and **"Interactive Mode"** (Step-by-step simulation with player intervention windows) to satisfy both speed-oriented analysts and immersion-oriented fans.

**UX & Layout Details:**
- **Initial Setup (Dropdown in `HeroSearchBox.tsx`):**
  - Add a **"Simulation Mode"** toggle or dropdown in `HeroSearchBox.tsx` (next to the Competition/Mode selection) with two options:
    - *Direct (Instan)*: Runs the entire tournament instantly.
    - *Interactive (Bertahap)*: Pauses between stages to allow user edits and AI chat interactions.
- **Playground Controls (Action Bar in `RightPanel.tsx`):**
  - If **Direct Mode** is active: The button remains a single `Play Simulation` button that triggers everything at once.
  - If **Interactive Mode** is active: The Action Bar adapts into a dual-button interface:
    - **Primary Button (`Play Matchday X`):** Advances the tournament by exactly one step (e.g. Matchday 1 -> Matchday 2 -> Matchday 3 -> Round of 16 -> Quarters -> Semis -> Final).
    - **Secondary Button (`Fast Forward / Skip to End`):** Bypasses the stepping mode and simulates all remaining stages instantly (user convenience exit).
- **Matchday/Stage Timeline:**
  - Render a visual horizontal timeline/stepper in `RightPanel.tsx` showing completed stages vs. pending stages so the user has immediate spatial awareness of the tournament's progress.

**Architectural Implications:**
- **Stateful Ground Truths:** The backend Monte Carlo engine needs to treat past simulated matchdays as "ground truth" (fixed scores/points) rather than predicting them again.
- **Progressive Stochasticity:** When at Matchday 2, the engine still runs 10,000 simulations for the *remaining* future matches to update probabilities (like % chances of qualifying), but locks in the actual results of Matchday 1.
- **Client State Tracking:** The frontend (Zustand) must explicitly track the `current_stage` to render the timeline UI and instruct the AI Agent on the tournament's current chronological context.

---

## 5. Direct Roster & Tournament Editor (Backlog / Future Idea)
**Goal:** Empower users with direct manual control to edit teams, groups, and structures (e.g., adding/removing teams or groups) via an intuitive visual interface without having to rely solely on natural-language AI prompts.

**UX & Layout Details (Sally):**
- **Pre-Playground Builder Page (`/custom-builder`):**
  - Add a dedicated page/stepper (or popup modal) accessible directly from the landing page when "Custom Tournament" is selected.
  - This acts as the *Roster Creator* before entering the playground: choose number of groups, number of teams per group, edit team names/power ratings, and validate.
- **Trigger in Playground:** Inside the Playground (`RightPanel.tsx`), add a "Modify Structure" or "Edit Roster" button next to the simulator controls when in Custom Tournament mode to reopen the CRUD interface.
- **The Roster Modal/Page:** Displays groups as editable cards:
  - *Team Actions*: Delete icon next to each team row; text inputs to edit names/base ratings directly.
  - *Group Actions*: An "Add Group" card at the end of the group list; a "Delete Group" trash icon on each group card header.
- **Strict Validation Feedback:** At the bottom, a real-time warning panel:
  - If the configuration is invalid (e.g., odd number of teams, unequal group sizes, or total teams not matching standard formats like 8/16/24/32), the "Save & Re-simulate" button is disabled and a clear instruction is shown (e.g., *"Groups must have equal size (4 teams per group)"*).

**Developer Implementation & Mobile Spacing (Amelia):**
- **Zustand Roster Store:** Implement simple CRUD actions in the frontend state: `addTeam()`, `removeTeam()`, `updateTeamRating()`, `deleteGroup()`.
- **Validation Engine:** Write a pure utility function `validateRosterConfig(groups)` that runs on every keystroke to check for tournament rule compliance before saving.
- **Monte Carlo Engine & Match Scaling (NumPy Refactor Details):**
  - *Dynamic Match Calculation*: If a group has $K$ teams, the number of matches is mathematically calculated as $K(K - 1) / 2$. The engine automatically scales the number of generated matches per group dynamically (e.g. $K=3 \implies 3$ matches; $K=4 \implies 6$ matches; $K=5 \implies 10$ matches).
  - *Symmetrical Group Constraint*: To leverage high-speed vectorized matrix math on GPUs/ROCm without dimension shape crashes during NumPy reshapes, all groups in the custom tournament must be **symmetrical** (i.e. all groups must contain the same number of teams, e.g. all 3-team groups or all 5-team groups).
  - *Generic Tie-Breakers*: Ensure that for custom sizes (where $K \neq 4$), the engine skips World Cup-specific 3rd-place calculations and defaults to qualifying the top 2 teams per group directly.
- **Mobile Spacing Optimization:**
  - *Timeline & Buttons*: On mobile viewports, the step-by-step controls in the action bar will collapse the secondary button (`Skip to End`) into an icon-only button (`>>` or `⏩`) to conserve space.
  - *Roster Editor*: Use a swipeable accordion or tabbed interface per group on mobile to prevent excessive vertical scrolling.

---

## 6. Multimodal Image Integration (Gemma / Minimax Vision Tool)
**Goal:** Leverage Google Gemma's multimodal capabilities (PaliGemma / Gemma 2 VLM) to allow users to upload images (tactical lineups, formation whiteboards, or news screenshots) and automatically translate them into simulation parameters.

**Agentic Tool Architecture:**
- Rather than forcing the main text-based Agent router to process raw images, the image is passed to a dedicated **Vision Tool** called `analyze_uploaded_image(image_base64, user_instruction)`.
- The AI Agent invokes this tool whenever the user uploads an image. 
- **Tool Logic (Gemma VLM on AMD GPU / Minimax Fireworks Serverless):**
  - Parses the image context based on the user's chat input.
  - Detects relevant sports entities (teams, players).
  - Understands the event context (e.g., "Injury detected for Mbappe", "Lineup adjustment to 4-3-3 for Japan").
  - Returns a structured JSON payload:
    ```json
    {
      "detected_team": "France",
      "event": "injury",
      "description": "Kylian Mbappe nasal fracture",
      "suggested_power_modifier": -0.15
    }
    ```
- **Agent Action:** The primary AI Agent receives the JSON response from the vision tool, verifies the context with the user, and automatically calls the `run_monte_carlo` simulator with the new power modifiers.

**UX Flow:**
- Chat input bar in the left panel features an attachment icon (`📎`).
- User uploads an image and types *"What if this happens?"* or *"Apply this tactic to Germany"*.
- The screen displays a loading spinner: *"Gemma is analyzing image..."* followed by the AI Agent showing the extracted details and applying the changes.



