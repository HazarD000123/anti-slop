# Libraries

Commands were checked against each project's docs in November 2026. They change, so read the current docs if one fails. Commands use `npx`; swap in `pnpm dlx` or `bunx` to match the project.

## shadcn/ui: the base

Source components you own, not a dependency.

```bash
npx shadcn@latest init
npx shadcn@latest add button dialog tabs
npx shadcn@latest search [registry]
npx shadcn@latest docs [component]
```

MCP server, so Claude can browse and install from registries:

```bash
npx shadcn@latest mcp init --client claude
```

Extra registries go under `registries` in `components.json`. Docs: https://ui.shadcn.com/docs/cli

## 21st.dev: finding components

A community registry of React and Tailwind components, plus templates, themes, shaders and gradients. Built to sit next to shadcn/ui.

- Open a component and use its shadcn install command, or its "Copy prompt".
- Agent setup: `npx @21st-dev/cli@latest init --client claude`
- Browsing is free. Free accounts get a daily limit of copies; membership removes it. Generating components with 21st AI uses a separate allowance.

Best when given a direct component link. Docs: https://21st.dev/mcp.md

## Magic UI: polished effects

Marquee, border beam, number ticker, animated list, terminal, dock, globe, and text animations. Same install flow as shadcn.

```bash
npx shadcn@latest add @magicui/globe
```

Has a paid Pro tier. Docs: https://magicui.design/docs/installation

## React Bits: signature moments

Animated text and backgrounds: split text, shiny text, decrypted text, light pillar, particles, gradient waves. The name suffix picks the variant: JS or TS, then CSS or TW.

```bash
npx shadcn@latest add @react-bits/SplitText-TS-TW
```

Or copy from a component's Code tab and install what it lists. Has a Pro section. Docs: https://www.reactbits.dev/get-started/installation

## Aceternity UI: bold landing page effects

Free copy-paste components built with Tailwind and Motion, compatible with shadcn. Paid templates and blocks. These are widely used, so retune them hard. Docs: https://ui.aceternity.com/components

## Watermelon UI

Another component registry worth browsing at https://ui.watermelon.sh. Read its docs for the current install method.

## Motion, scroll and 3D

- **Motion** (`npm i motion`): reveals, layout animation, shared elements, springs. The default for React.
- **GSAP** (`npm i gsap`): timelines, ScrollTrigger, SplitText. Better for choreographed sequences.
- **Lenis** (`npm i lenis`): smooth scroll, for long scroll-driven pages only.
- **three.js** (`npm i three`), **React Three Fiber** (`npm i @react-three/fiber @react-three/drei`), **OGL** (`npm i ogl`, much smaller, good for a single shader background).

## Fonts

- **Fontshare** (https://www.fontshare.com): Satoshi, Cabinet Grotesk, General Sans and others, free.
- **Google Fonts** (https://fonts.google.com): Fraunces, Newsreader, Instrument Serif, Playfair Display, Geist.

Self-host what you ship (`next/font` or `@fontsource`) so type doesn't shift on load.

## Skills that pair well

```bash
npx skills add greensock/gsap-skills
```
```bash
npx skills add emilkowalski/skills --skill animate
```
```bash
npx skills add CloudAI-X/threejs-skills --skill threejs-animation
```
