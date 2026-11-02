---
name: audit
description: Audit a website for the tells that make it look AI-generated and fix them. Use when someone says a site looks generic, like AI slop or AI-made, or asks for a design review before launch.
---

# Slop audit

Open the page in a browser at desktop and phone width and read its CSS and copy. Report each tell found as `tell, where, the fix`. Then ask before fixing.

## Visual tells

- Purple-to-blue gradients, especially on headline text
- Centered hero, then a row of three identical feature cards
- A stats row nobody can verify ("10,000+ teams", "99.9% uptime")
- `rounded-2xl` or `rounded-3xl` on everything
- Glassmorphism, glow or gradient blobs used everywhere instead of once
- Two side-by-side "get started" and "learn more" buttons on every section
- Default font alone, with no second voice
- Pure `#000` or neutral grey where a tinted dark would fit
- Sections fading and sliding up identically on scroll
- Emoji as icons or in headings
- Stock or generated images standing in for the real product

## Copy tells

- Placeholder identity: "YourBot", "Your Name", "Acme"
- "Revolutionize", "supercharge", "seamless", "unlock", "elevate", "game-changing"
- "Trusted by" with no logos, testimonials from nobody, invented numbers
- "It's not just X, it's Y", rule-of-three lists, em dashes everywhere
- Headlines about the category rather than what this thing does

## How to fix

- Trace the palette back to something real, then cut to one accent.
- Replace a card row with the layout this content actually wants.
- Delete any number that can't be verified. Render it as unfinished rather than inventing it.
- Keep one signature detail, and remove competing effects.
- Hand copy problems to the `human-copy` skill.

Finish with a before and after screenshot of the biggest change. Don't call it fixed until you've looked at it.
