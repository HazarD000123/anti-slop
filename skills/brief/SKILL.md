---
name: brief
description: Write a creative brief before building or redesigning a website, so the result doesn't look AI-generated. Use when someone asks for a website, landing page, portfolio or redesign, or says their site looks generic or AI-made.
---

# Creative brief

Do this before writing any UI. A site looks generated when nobody decided anything, so decide first.

Ask only what you can't find in the project, once, in one message:

1. What is it, and who is it really for?
2. Which real sites do they love? Get URLs or saved pages. If they have some, run `match-reference` next.
3. What real material exists: screenshots, photos, numbers, logos?

Then write `BRIEF.md` with exactly these sections:

- **Point of view:** one sentence on what this site is like, as a place, not a category. "A vampire's study, not a server room." "Le Monde meets a good notebook."
- **Palette from a source:** every colour traced to something real: the logo, the product's UI, the avatar, the subject's world. One accent, used rarely enough to mean something. Tinted blacks, never pure `#000` or neutral grey by default.
- **Two fonts on purpose:** one with character (a serif or a themed face) and one that disappears. Say what each is for. Never the framework default alone.
- **One signature detail:** the single thing people will remember. Everything else stays quiet.
- **Motion:** one reveal, one easing, used once, under 24px of travel. If an animation carries no meaning, it doesn't exist. Honour `prefers-reduced-motion`.
- **Page structure:** in the order this subject needs, not hero, three cards, testimonials, CTA.
- **Real content list:** what's real and what's missing. Missing figures stay visibly unfinished and never get invented.
- **Avoid:** the tells from the `audit` skill this project is most at risk of.

Show the brief and wait for a yes before building. Build in phases and check each one in a browser at desktop and phone width.
