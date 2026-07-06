# Design System & Guidelines - Fuenzer Sports

This design system is intended for building a sports simulation platform that prioritizes performance and data density. The visual style is a blend of **Minimalism** and **Glassmorphism**, designed to feel like a professional sports *mission control* screen.

## 1. Main Theme: Strict Dark Mode
The design adopts a deep dark color palette to reduce visual fatigue (*eye strain*) when users are looking at a full screen of fast-moving numbers.

- **Background Level 0 (Main):** `bg-[#0b1326]` (Deep dark, almost pitch black)
- **Background Level 1 (Panels/Sidebar):** `bg-[#131b2e]` (Slightly lighter slate)
- **Primary Accent (Active Text/Icons):** Cyan to Electric Blue (e.g., `#4cd7f6`). This Cyan gradient is the signature for *hero buttons* and *highlights*.
- **Primary Text:** `text-[#dae2fd]` (Bluish-white for contrast but soft on the eyes).
- **Secondary/Metadata Text:** `text-[#869397]` (Bluish-gray for less critical elements).

## 2. Typography (Dual Font System)
Font usage is strictly differentiated based on content function:

- **Primary Font (Inter):** Used for all regular UI text, headings, player names, team names, AI chat, and UI labels. 
- **Data Font (JetBrains Mono):** A *monospace* font EXCLUSIVELY USED FOR ALL NUMBERS (probabilities, standings points, goal differences). This is mandatory to ensure consistent character widths and to facilitate vertical scanning of number columns.

## 3. Specific Components (UI/UX)
According to the *Playground* and *Landing Page* mockups:

- **Hero Search Box (Stitch Style):** Adapting the *Google Stitch* style. The input box has a very dark *background* with a thin `rgba(255, 255, 255, 0.1)` *border* and soft rounded corners (*rounded-2xl* or *3xl*).
  - Thin, gray *placeholder* text.
  - Inside the bottom part of the *input area*, there are controls (*dropdown chips*) with semi-transparent backgrounds.
  - The action button (Enter) has a small *glow* effect or a solid *cyan* color in the bottom right corner inside the box.
- **Quick Action Chips:** Located just below the Hero Box, capsule-shaped with a thin *border* and a leading icon. Small text (`text-sm`) and reacts with a *glow/highlight* on *hover*.
- **Navbar & Footer:** Very clean and blends with the *background*. The Navbar has a light *backdrop-blur* when *scrolled*.
- **Glass Tooltips & Panels:** Result panels (*Match Results* or *Knockout Brackets*) use a glass effect (*backdrop-filter blur*) with a slightly transparent background (e.g., `bg-slate-900/80`) and a 1px `rgba(255, 255, 255, 0.1)` *border*.
- **Standings Table (Live):** 
  - Must have indicators (small red/green arrow icons) for any changed positions.
  - The table must perform a *smooth translation* (animation) from *Framer Motion* or *CSS Transition* when the order of the standings rows changes due to the Monte Carlo algorithm.
  
## 4. Match Probabilities & Status
Use *semantic colors* to indicate results/chances:
- **Safe/Win/Qualify:** Bright Green (`text-emerald-400` or `#10B981`)
- **Draw/Vulnerable/Playoff:** Bright Yellow/Orange (`text-amber-400` or `#F59E0B`)
- **Loss/Eliminated/Danger:** Bright Red (`text-rose-400` or `#EF4444`)

These colors are only used for numbers/indicators. Do not use them as background colors for large blocks (except for small bar-chart shapes inside match cards).
