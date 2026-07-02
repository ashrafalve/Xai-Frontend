# Xai Intelligence Workspace

A prototype demonstrating an AI-powered data intelligence platform: transforming raw data → structured intelligence → actionable insight → AI automations. Built as a marketing site with interactive 3D visuals and scroll-driven animations.

## Tech Stack

- **Next.js 14+** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom design tokens
- **Framer Motion** - Component entrance animations
- **GSAP + ScrollTrigger** - Scroll-driven state changes
- **React Three Fiber / Three.js** - 3D particle scenes

## Getting Started

```bash
git clone <repo-url>
cd xai
npm install
npm run dev
```

Open http://localhost:3000. Node.js 18+ recommended.

## Project Structure

```
src/
├── components/
│   ├── sections/   # Page sections (Hero, InsightFlow, DashboardPreview, SignatureInteraction)
│   ├── ui/         # Reusable components (Button, NavBar, SectionHeader)
│   └── three/      # R3F scenes (ParticleField, ClusterScene)
```

## Key Animation & Interaction Decisions

- **Hero**: Particles → grid visualization represents raw data organizing into structured form
- **Insight Flow**: GSAP ScrollTrigger drives active card state based on viewport center
- **Signature Interaction**: Scroll progress directly interpolates particle positions to 3D lattice

[Video walkthrough: link here]

[Live demo: link here]