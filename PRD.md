# Product Requirements Document (PRD)
**Project:** Fuenzer Sports | AI-Driven Tournament Simulator
**Headline:** Ask Anything. Simulate Everything.

## 1. Product Vision
Fuenzer Sports is an AI-driven sports analytics simulation platform. It functions as a hybrid between an instant search interface (like Perplexity AI) and the Football Manager game. Users simply type a question regarding a tournament (e.g., "What are Spain's chances of passing the group stage in the 2026 World Cup?"), and the engine will run thousands of mathematical simulations (Monte Carlo) in seconds. The results are presented in the form of an interactive animated standings table along with analytical commentary from the AI.

## 2. User Flow (Zero-Friction UI)

### Phase 1: Landing Page (The Input Phase)
- **Concept:** Acts directly as the primary interaction point (*Search-to-Workspace*). There is no separate *Auth Wall* page.
- **Navbar:** Located at a *fixed-top* position. Left: "Fuenzer Sports" logo. Center (optional): Standings, History. Right: Language Toggle (EN/ID), notification bell icon, and "Sign In / Sign Up" button.
- **Hero Section:** Prominent main slogan ("Ask Anything. Simulate Everything."). Below it is a giant *Prompt/Chat Box* styled like *Google Stitch*.
- **Chat Box Detail (Stitch Style):** 
  - Large text input with an inviting *placeholder*.
  - In the bottom left corner of the input box, there are *chips/dropdowns* for **AI Model (Auto/Fast/Pro)** and **Mode (Live/Custom)**.
  - In the bottom right corner is the execution button (*Submit Arrow*).
  - Just outside/below the box, there are **Quick Action Chips** containing instant prompt recommendations (e.g., "Simulate Group A").
- **Below the Fold Content:**
  1. **Statistics Bar:** 4 metric numbers (e.g., *10k+ Simulations, 99.8% Accuracy*).
  2. **Video Demo / GIF:** An interactive preview of the simulation results.
  3. **Features & Capabilities:** Three main pillars (AI Analytics, Live Simulation, Interactive Charts).
  4. **Why Choose Fuenzer (Benefits):** Instant speed, precision accuracy, and smart commentary.
  5. **FAQ:** Common questions that can be expanded/collapsed (Accordion).
- **Footer:** Consists of the logo, standard navigation links (Home, Privacy, Terms), and social media/GitHub links.
- **Auth:** Uses a **Guest First** mode. Conversation data and *state* are stored locally using `localStorage`.

### Phase 2: The Transition (Smooth Animation)
- When the user presses "Enter", there is no page redirect (no static *loading*).
- Uses a smooth transition (*push state*): The Hero section shrinks and slides to the left becoming the Chat Panel, while the right side opens fully into the *Playground/Data Visualizer*.

### Phase 3: The Workspace / Playground
- The screen is divided into a split-view (100vh).
- **Left Panel (35%):** AI Chat. Where the *user* provides follow-up *prompts* and views the AI's analytical narrative.
- **Right Panel (65%):** Simulation Visuals. Contains the live standings table, tournament bracket, and probability metrics.
- **Mandatory:** The standings table must have a shift up/down animation (*smooth translation*) like F1/MotoGP broadcasts every time the simulation data changes.

## 3. API & Authentication Flow

*LocalStorage-First* approach for maximum speed.

- **Guest (Default):** The user sends a POST `/simulate` request without authorization. Simulation results and conversations are saved to the browser's `localStorage` using `Zustand Persist`.
- **Login (Optional):** When the user clicks "Sign In with Google", the token is validated. The *Frontend* is responsible for syncing the `localStorage` history to Firebase's **Firestore Database** for cloud *backup*.
- **Stateless Backend:** The *Python/FastAPI* backend only acts as a *Computation & AI Gateway*. The backend DOES NOT store conversations. This drastically reduces server load.
- **External API Caching (Critical for Rate Limiting):** To handle the 10 requests/minute limit of the Football-Data.org free tier, the backend must implement a cache layer (e.g., in-memory or Redis). Static data like standings and fixtures are cached for a set duration (e.g., 2 hours for standings, 24 hours for team list/fixtures) to prevent direct hits on the external API for every user request.

