---
name: components
description: Choose and install UI components and effects from shadcn/ui, 21st.dev, Magic UI, React Bits, Aceternity UI and others, then restyle them so they don't look like the library's demo. Use when building UI, adding a hero effect, picking a component library, or when asked for something like a dock, marquee, animated text, background effect or command palette.
---

# Components

Never make UI from scratch when a good component exists, and never ship one looking like its demo page. Default components are half of why AI sites look the same.

## The stack

| Layer | Use | Job |
|---|---|---|
| Base | shadcn/ui | Buttons, dialogs, inputs, tabs, menus. Accessible behaviour you own as source. |
| Find | 21st.dev | Search real community components when you know the feel but not the name. |
| Effects | React Bits, Magic UI, Aceternity UI | The signature moment: animated text, beams, backgrounds, docks. |
| Motion | Motion, GSAP | Reveals, layout animation, timelines, scroll. |
| 3D | three.js, React Three Fiber, OGL | When 3D is the signature detail. A whole 3D world: use `immersive`. |
| Icons | lucide | One icon set per site. |

Details and exact commands: `references/libraries.md`.

## How to work

1. **Read the brief first.** Know the palette, fonts and the one signature detail. No brief yet? Run `brief`.
2. **Check what's installed.** Read `components.json` and `components/ui`. Reuse before adding.
3. **Pick by job, not by looks.** Ask what the component has to do on this page. If the answer is "look cool", it had better be the signature detail.
4. **Prefer the person's picks.** If they give a URL from 21st.dev or anywhere else, use that exact component. Fetch its source rather than recreating it from a screenshot.
5. **Install it, then read every line.** These become your files. Remove anything you don't use.
6. **Retune it.** See below. This step is not optional.
7. **Look at it** in a browser at desktop and phone width, next to the rest of the page.

## Retune everything

A library component is finished when someone who knows the library wouldn't recognise it at a glance.

- **Colours:** replace demo purples, blues and rainbow gradients with the brief's palette. Move them to CSS variables.
- **Radius:** set `--radius` on purpose, and use one radius logic across the site.
- **Type:** swap in the site's fonts. Default sizes and weights give it away.
- **Timing:** slow most demo animations down and cut their distance. Check they only play when they mean something.
- **Density:** remove extra particles, glows and borders that were only there to impress in a gallery.
- **Copy and data:** delete every demo string, avatar and number.
- **Real states:** add hover, focus, disabled, loading and empty states. Check keyboard use and `prefers-reduced-motion`.

Credit a borrowed effect in a one-line comment, with where it came from and what you changed.

## Limits

- **One signature effect per page.** Beam plus shimmer plus particles plus spotlight is how a page turns back into slop.
- **Effects go in heroes and moments, not everywhere.** Body sections stay quiet.
- **Don't mix libraries' looks.** Different sources are fine once they've all been retuned to one system.
- **Check the weight.** WebGL and heavy animation need a plain fallback, and shouldn't cost phones their frame rate.
- **Check licences.** Free tiers, paid "Pro" components and daily limits exist. Don't paste paid components into public repos.
