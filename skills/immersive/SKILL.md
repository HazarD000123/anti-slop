---
name: immersive
description: Build an award-level immersive 3D website, where the whole site is one real-time WebGL world driven by scroll, like igloo.inc or Lusion. Use when someone wants a three.js site, a scroll-driven 3D experience, "something like igloo.inc", or a site that feels like a game or film instead of a page.
---

# Immersive sites

These sites are worlds, not pages. The camera moves through one continuous scene, and scrolling is how you travel. Most fail for one reason: they're a normal page with a 3D object stuck behind it.

## Be honest about scope first

Tell the person this before building:

- igloo.inc was made by a small team of specialist technical artists, using Houdini and Blender for assets and custom tools built per project. Code alone won't reproduce its hand-made models.
- Claude can do the code, shaders, camera, particles, transitions and performance work. The hero 3D model is what most separates good from great, so ask for one: their own, a commissioned one, or a properly licensed one.
- A smaller world done well beats a big one done badly. One location and one great transition is a real project.
- Never reuse igloo.inc's or anyone else's models, textures, audio or code. Fan "recreations" on GitHub contain their assets. Learn the techniques and make your own world.

If they only want a nice 3D hero on a normal site, this skill is too much. Use `components`.

## The order that works

1. **Write one sentence for the world.** Where are we, and what happens as we move? "A frozen mountain with an igloo that breaks apart to reveal the projects." Run `brief` with this as the point of view.
2. **Storyboard the journey in grey.** List scenes, what the camera does, and how each hands over to the next. Prototype the camera flight with untextured shapes before making anything pretty. A boring flight can't be saved by materials.
3. **Start from the starter.** Copy `templates/immersive-starter`, run it, then replace its world. Its bones are the point: scroll timeline, post stack, quality tiers, preloader and sound.
4. **Build in the browser.** Work on the live scene with a debug panel, not by editing blind. Look at it after every change.
5. **Make the hero, then the world, then the transitions, then the UI.** Add sound before calling anything finished.
6. **Measure from the first day.** Watch frame time on a mid-range phone, not just your own machine.

Techniques, with code: `references/techniques.md`. Asset compression and loading: `references/assets.md`.

## What makes these feel expensive

- **One continuous world.** Transitions move through space, and never fade between "sections".
- **Atmosphere.** Fog, depth, grain and soft bloom do more than polygon count.
- **A restrained palette.** igloo.inc is nearly monochrome: cold grey-blue with white light and a little chromatic fringe. Colour is the expensive-looking decision here too.
- **Camera with weight.** Eased scroll, slight drift, and banking into turns. Never a straight line at constant speed.
- **Hand-made transitions.** Mix two or three effects, such as chromatic aberration, displacement and a frost or noise mask.
- **Things that respond.** Particles that react to the pointer, colour that follows speed, sound tied to motion.
- **Sound.** Off by default, with a clear toggle. It's half of why these sites feel like an experience.
- **Tiny, sharp type.** See below.

## Type

Big tight sans headlines (`-0.05em`, 90px, Inter or system-ui) are the most AI-looking thing you can put on one of these sites. Here the world is the headline.

- One characterful typeface, self-hosted, 10 to 13px, placed at the corners and edges.
- A custom wordmark drawn as SVG, not typed in a font.
- One small invented system that belongs to this site and no other, such as a live readout of something real, marks, numbering, or a way text arrives. Don't copy igloo's or the starter's: the starter's camera readout and registration marks are examples to replace.
- Screen readers must get the real text, including while it animates.

## Resolution

Blurry WebGL looks cheap. Render at up to 2 to 2.5x device pixels and let the quality check lower it only when frames really suffer. Keep multisampling on through post-processing. Add detail in the shader for anything the camera gets close to, and keep grain subtle.

## Don't ship without

- A preloader with real progress, and shaders compiled before the reveal so nothing hitches.
- Quality tiers that drop resolution and particle counts automatically.
- A deliberately designed phone version. Most visitors from social links are on phones.
- `prefers-reduced-motion`: no camera travel, but all the content.
- Real, accessible HTML for every piece of content, with working links and keyboard navigation, even if the visuals are WebGL. Search engines and screen readers can't read a canvas.
- A fallback for no WebGL.
- Clean-up on route changes: dispose of geometry, materials and textures.
- A first load that's small, with heavy assets loading progressively. Check the real transfer size.

Finish with `audit` and `human-copy`. Immersive sites still have copy, and it's still the first place they read as AI.
