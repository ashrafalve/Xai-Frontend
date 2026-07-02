# Xai – Intelligence Workspace
### High-Fidelity Product Experience Prototype

This repository contains the engineering execution of the RacoAI Frontend Challenge. It is a single-page interactive product prototype that visually explains how Xai ingest, processes, and morphs raw data into structured intelligence and actionable automation pipelines.

Live URL: [https://xaiworkspace.vercel.app/](https://xaiworkspace.vercel.app/)  
Design File: [Figma Mockup Design](https://www.figma.com/design/nIA9tZFp8SWQPPL6zevbJl/Untitled?node-id=0-1&t=kxy29yHTcyMCaDcf-1)

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router, Turbopack bundling)
- **Programming Language:** TypeScript (strict type checking enabled)
- **Styling Architecture:** Tailwind CSS v4 using semantic color configurations (`bg`, `surface`, `border`, `accent`, `accent2`)
- **Animation System:** Framer Motion (choreography, layouts, and spring components)
- **Scroll Timelines:** GSAP v3 + ScrollTrigger (viewport active state coordination)
- **3D Graphics Graphics:** Three.js + React Three Fiber + `@react-three/drei` (WebGL points, neural connections, and orbit controls)

---

## 📁 Repository Directory Structure

```
xai/
├── app/
│   ├── globals.css      # Custom design tokens, Tailwind v4 imports, global rules
│   ├── layout.tsx       # Next.js workspace viewport configurations
│   └── page.tsx         # Page assembly rendering Hero, Stages, Dashboard & Signature
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx                 # Hero section layout + 3D particle canvas
│   │   │   ├── InsightFlow.tsx         # Scroll spotlight stages + waveform equalizers
│   │   │   ├── DashboardPreview.tsx    # Live SaaS dashboard shell + sidebar state machine
│   │   │   └── SignatureInteraction.tsx # Interactive WebGL panel grid & deliverables
│   │   ├── ui/
│   │   │   ├── Button.tsx               # Reusable spring motion buttons
│   │   │   ├── NavBar.tsx               # Sticky blurring top navigation links
│   │   │   └── SectionHeader.tsx        # Standardized eyebrow / title header layout
│   │   └── three/
│   │       ├── ParticleField.tsx        # Hero transition nodes (chaos to grid layout)
│   │       └── ClusterScene.tsx         # Multi-canvas Chaos, Process, and Order scenes
├── product_experience_prototype_documentation.md  # Step-by-step layout & concept breakdown
└── README.md            # Installation and engineering summary
```

---

## 🚀 Running the Project Locally

### Prerequisites
Make sure you have Node.js 18+ and npm installed.

### 1. Clone the repository and hop inward:
```bash
git clone https://github.com/ashrafalve/Xai-Frontend.git
cd Xai-Frontend/xai
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start page server locally:
```bash
npm run dev
```

The prototype will launch at `http://localhost:3000`.

### 4. Build bundle locally:
```bash
npm run build
```

---

## ⚡ Key Animation & Interaction Decisions

1.  **Hero Transition Scene:** Rather than loaded marketing vector assets, the Three.js Canvas visualizes raw nodes floating chaotic purple on the left mapping to grid points that pulse in teal/green on the right. Vertices calculations are optimized via React `useMemo` hooks, and mouse tracking inputs dynamically repel dots.
2.  **Scroll Spotlight Stages:** In the "Three stages. One continuous flow" section, GSAP ScrollTrigger detects viewport offsets. The card in center spotlight expands and plays an equalizer wave representation of processing data, while other stages dim.
3.  **Active Dashboard States:** Click selections in the sidebar navigation trigger dynamic changes across the dashboard. Stats, chart data averages, and logging rows cross-fade smoothly using Framer Motion `AnimatePresence`. Bar metrics feature interactive tooltips displaying absolute runs.
4.  **Multi-Scene Signature Interaction:** The final section lists three separate Three.js Canvases side-by-side representing Chaos, Process, and Order. OrbitControls permit mouse scrolls to zoom and drag rotations. Clicking node shapes maps parameter data to an overlay HUD display.

---

## 📄 Deliverable Links
- **Product Documentation:** Detailed design choices are documented at `product_experience_prototype_documentation.md`.
- **Live Deployment:** [xaiworkspace.vercel.app](https://xaiworkspace.vercel.app/)
- **Figma Design Link:** [Figma Design Canvas](https://www.figma.com/design/nIA9tZFp8SWQPPL6zevbJl/Untitled?node-id=0-1&t=kxy29yHTcyMCaDcf-1)