[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)


## ChatGPT 5 Prompt Builder

Build better prompts, faster. A focused, local-first Prompt Builder that helps you structure high-quality AI instructions in minutes — not hours.

Deployed at https://chatgpt-prompt-builder.vercel.app/

### Why Prompt Builder

- Craft clear, repeatable prompts with a guided, professional workflow
- Save and reuse what works across different projects and contexts
- Keep everything local and private (no server, no accounts)
- Simple, elegant UI powered by Next.js and shadcn/ui

---

### Feature Highlights (v1.0)

- Workspace Management

  - Create multiple workspaces for different projects or clients
  - Quick switching between workspaces
  - Each workspace maintains its own forms and presets

- Structured Prompt Composer

  - Persona, Brief, and Quality Gate organized into clear sections
  - Inputs for Task, Context, References, Format, Evaluation Criteria, and Extra Instructions
  - Output renders only the sections you actually filled (blank fields are omitted)

- Output Panel You’ll Actually Use

  - Live compiled prompt preview
  - Copy to clipboard with success feedback
  - Save directly as a preset with a name

- Presets (Local & Portable)

  - Save, load, and delete presets per workspace
  - Export presets as JSON
  - Import presets from JSON
  - Instantly apply a preset to the form

- Design System & Theming

  - shadcn/ui components with tailored styles
  - Primary action buttons are solid black for visual clarity
  - Theme palette tuned to your brand: #000000, #14213d, #fca311, #e5e5e5, #ffffff
  - One-click light/dark mode toggle

- Mobile-First UX

  - Column-first responsive layout for small screens
  - Full-width controls on mobile where it matters

- Local-First & Private
  - All data is stored in your browser via localStorage
  - No external calls, no backend, no tracking

---

### How It Works

- Form State & Persistence

  - Each workspace stores its own form state and preset list
  - The current workspace is remembered between sessions
  - Everything persists locally via localStorage

- Output Logic

  - The output is compiled from only the fields you’ve filled in
  - Empty fields are omitted — no placeholder noise

- Preset Files
  - Exported presets are plain JSON
  - Import merges presets into your current workspace

---

### Getting Started

Prerequisites: Node.js 18+, pnpm

1. Install dependencies

```
pnpm install
```

2. Run in development

```
pnpm dev
```

3. Build & start production

```
pnpm build
pnpm start
```

The app runs on http://localhost:3000

---

### Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui components
- LocalStorage for persistence
- uuid for preset IDs

---

### Project Structure (key files)

- `src/app/page.tsx` — Main page: layout, output, presets, workspace modal
- `src/components/prompt/StepsPanel.tsx` — Prompt form sections & actions
- `src/components/ui/*` — UI primitives (button, input, select, etc.)
- `src/lib/types.ts` — Core types
- `src/lib/storage.ts` — LocalStorage keys & helpers
- `src/lib/personas.ts` — Persona suggestions

---

### Who This Is For

If you write AI prompts professionally — product, growth, engineering, content — you need a repeatable way to produce clarity. Prompt Builder gives you a simple, high-signal workflow to:

- Turn vague requests into structured, high-quality instructions
- Share consistent prompts across teams and projects (via presets)
- Move fast without sacrificing quality or privacy

No fluff, no learning curve, just a frictionless way to get to great prompts.

---

### Roadmap

- Prompt History with timestamps and 1‑click reuse
- Shareable presets (URL or file)
- Rich preview/formatting options
- Optional cloud sync

Have ideas? Open an issue or start a discussion.

---

### Version

v1.0.0

---

## License

This project is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

If you use this project, please provide attribution to **Anjana Jayaweera** with a link back to this repository.  

### Attribution Example

When reusing or referencing this project, please use the following credit line:

> ChatGPT Prompt Builder by [Anjana Jayaweera](https://github.com/anjana-j), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
