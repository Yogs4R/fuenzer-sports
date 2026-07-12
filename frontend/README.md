# 🏆 Fuenzer Sports — Frontend (React & Vite)

The interactive user interface for **Fuenzer Sports**, an AI-driven tournament simulator. Designed with a strict dark-mode aesthetic, micro-animations, and fluid layout transitions.

## 🛠️ Technology Stack
- **Core:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Strict Dark Mode)
- **State Management:** Zustand (with LocalStorage state persistence)
- **Animations:** Framer Motion (for smooth standings table row re-ordering and page transitions)
- **Icons:** Lucide React

## 🚀 Key Features
1. **Zero-Friction Search Interface:** An intuitive, Google Stitch-style prompt box that acts as the entry point for simulations.
2. **Dynamic Monte Carlo Progressions:** Watch matchdays play out in real-time with smooth layout transitions as team standings update dynamically.
3. **Multimodal Vision Upload:** Click the image icon to upload tactical lineups or screenshots to influence predictions.
4. **Voice-to-Text:** Speak your tournament scenario prompts directly into the app.
5. **Interactive Standings & Knockouts:** View probability tables, dynamic brackets, and live standings edits.

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Installation
Navigate to the `frontend/` directory and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Production Build
To build the static assets for deployment (e.g., Cloudflare Pages):
```bash
npm run build
```
The output directory will be `dist/`.
