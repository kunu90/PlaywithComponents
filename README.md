# PlaywithComponents — A UX Designer's AI Vibe Coding Playground

> A personal learning lab where I explore the intersection of UX design thinking and AI-assisted front-end development — one component at a time.

Latest update:
Latest update: Dialog, Tabs, Accordion, and Slider — wired into the component explorer with interactive variant cards (form/destructive dialogs, line/vertical tabs, single/multiple accordion, range/stepped/vertical sliders) plus Framer Motion spring interactions on type selectors.

Toast(Sonner) UI Tweaks
I used Cursor to iteratively refine the toast UI in this project:

What I changed
Customized success and error toast colors using sonner’s CSS variables and our theme tokens.
Updated success/error icons so the success icon uses the success color token and the error icon uses the destructive color token.
Ensured the visual treatment looks intentional in both light and dark modes, while forcing light-style success color where desired.
How I worked in Cursor

Searched for the toast implementation (Toaster and sonner.tsx) and theme tokens (globals.css) using Cursor’s file/grep tools.
Edited the Toaster component to:
Set --success-bg, --success-border, --success-text, --error-bg, --error-border, --error-text in the style prop.
Override icon colors inline on the Lucide icons (CircleCheckIcon, OctagonXIcon) to match the success/destructive tokens.
Ran the app locally via npm run dev directly from Cursor and inspected DOM paths to verify which elements were being styled.
Mistakes and how I fixed them

Initially tied success colors to theme variables in a way that made the success toast look like dark mode even when I wanted a light-style appearance. I corrected this by:
Swapping the success background to a fixed oklch(...) value that matches the light --chart-2.
Adjusting success text/border to keep contrast and visual consistency.
At first, only the toast background/border changed, but the icons stayed neutral. I fixed this by explicitly setting style={{ color: "var(--chart-2)" }} for success and style={{ color: "var(--destructive)" }} for error on the SVG icons.
When pushing to GitHub, the first git push was rejected because the remote branch had new commits; I resolved it directly in Cursor by running git pull --rebase followed by git push.
This small workflow shows how I used Cursor not just to edit code, but also to debug UI details, inspect DOM paths, correct theme edge cases, and handle git operations end-to-end without leaving the editor.



Link to view the latest changes: https://playwithcomponents.vercel.app/
---

## The What and Why?

I'm a UX designer learning to code with the help of AI tools. This repository is not a finished product — it is a **deliberate, hands-on learning environment**.

The goal was simple: instead of reading about UI components, I wanted to *feel* them. I downloaded the full [shadcn/ui](https://ui.shadcn.com/) component library into a local Next.js project, opened each file, and started editing — changing props, tweaking styles, and asking "why does this behave that way?" at every step.

The AI (Cursor) acted as a pair programmer. I directed the design intent; the AI helped me understand what the code was doing and how to change it. This is what the industry is starting to call **vibe coding** — using natural language and intuition to drive code, with AI filling the technical gaps.

---

## What I Learned 

### 1. Components are design decisions frozen in code
Every shadcn component is essentially a set of UX decisions — spacing, interaction states, accessibility roles — expressed as TypeScript. Editing them directly made me understand *why* those decisions were made, not just what they look like.

### 2. Props are the same as design tokens, just more literal
Changing `position="top-center"` to `position="top-right"` on a toast is the same mental model as moving a notification in a design file — except here, the change is permanent and reviewable.

### 3. Motion is a first-class UX concern, not an afterthought
I used [Framer Motion](https://www.framer.com/motion/) for spring-based layout transitions and [GSAP](https://gsap.com/) for a magnetic cursor effect. Seeing the `stiffness` and `damping` values directly map to how *alive* a UI feels was one of the most concrete connections between physics and UX I've experienced.

### 4. The feedback loop in code is faster than in design tools
Hot-reloading a change to a toast's border-radius from `rounded-lg` to `rounded-full` and seeing it instantly in the browser is a tighter feedback loop than any design tool I've used. That speed changes how you think about iteration.

---

## What's Inside

```
src/
├── components/
│   ├── ui/               ← 56 shadcn primitives (accordion, badge, button, card, sonner, slider…)
│   └── blocks/           ← Custom compositions built from primitives
│       ├── interactive-bento-grid.tsx   ← Card + Badge + Button layout with Framer Motion layoutId
│       └── magnetic-cursor-layer.tsx   ← GSAP-powered custom cursor (currently toggled off)
└── app/
    ├── layout.tsx         ← Root layout with <Toaster /> mounted globally
    └── page.tsx           ← Component explorer (sidebar + variant cards + live previews)
```

---

## Highlighted Experiments

### Toast Notification System (`src/components/ui/sonner.tsx`)
This was the component I spent the most time with. Starting from the default shadcn Sonner wrapper, I made the following deliberate UX changes:

| What I changed | Why I changed it | What I learned |
|---|---|---|
| `position="top-right"` | Follows standard notification UX convention (top-right is where users expect alerts) | Placement is a UX contract, not just a style preference |
| `expand={true}` | Toasts stack as a visible deck instead of collapsing | Shows the user there are multiple notifications without overwhelming them |
| `richColors={true}` | Green for success, red for error — no ambiguity | Colour should carry semantic meaning, not just aesthetics |
| `closeButton={true}` | Gives users explicit control to dismiss | Respects user agency — a core UX principle |
| `rounded-full` + `backdrop-blur-md` | Pill shape and glass morphism for the toast container | Explored how CSS utility classes express visual design language |

### Theme Switching (`src/components/blocks/theme-switcher.tsx`)
I added a Light/Dark/System dropdown that updates the app theme globally (via `next-themes`) and makes Sonner automatically use the matching theme palette.

### Interactive Bento Grid (`src/components/blocks/interactive-bento-grid.tsx`)
A custom block built entirely from shadcn primitives (`Card`, `Badge`, `Button`) and animated with Framer Motion. Each tile uses `layoutId` for smooth positional transitions and `whileHover` for spring-physics-based lift effects (`stiffness: 300, damping: 20`).

### Magnetic Cursor Layer (`src/components/blocks/magnetic-cursor-layer.tsx`)
A GSAP-powered component that creates a custom cursor ring that follows the mouse with a trailing, physics-like delay. Taught me how pointer-based animations work differently from declarative UI state.

---

## Tech Stack

| Tool | Role |
|---|---|
| [Next.js 16](https://nextjs.org/) | App framework (App Router) |
| [shadcn/ui](https://ui.shadcn.com/) | Component library (56 primitives installed) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Spring-based UI transitions and layout animations |
| [GSAP](https://gsap.com/) | Complex pointer and scroll-driven effects |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notification system |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |

---

## How to Run It Locally

```bash
git clone https://github.com/kunu90/PlaywithComponents.git
cd PlaywithComponents
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Focus Grid (iOS)

Native SwiftUI app in [`FocusGrid/`](FocusGrid/). Open `FocusGrid.xcodeproj` in Xcode 16+ and run on a physical iPhone — see [FocusGrid/README.md](FocusGrid/README.md).

---

## The Bigger Picture

This project is a record of me bridging the gap between design and engineering — not to become a full-stack developer, but to become a designer who can have a genuinely informed conversation about implementation, who can prototype with real components instead of mock-ups, and who understands the cost and effort behind every UX decision.

AI tools like Cursor accelerate that learning. They don't replace the need to understand *why* — they just remove the friction of *how*, so you can focus on design thinking at the code level.
