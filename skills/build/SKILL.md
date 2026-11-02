---
name: build
description: Run the whole workflow for building a website that doesn't look AI-made, from brief to deploy. Use when someone asks to build, remake or redesign a whole site or landing page and wants it to look properly designed.
---

# Build a site

Run these in order. Don't skip ahead to code, and stop for approval where marked.

1. **Brief.** Run `brief`. **Wait for a yes.**
2. **Reference.** If they gave sites they love or saved pages, run `match-reference` and write down the measurements. If they gave none, look at two or three strong real sites in their space, and show what you'd borrow from each.
3. **Plan the page.** List each section, its job, its real content, and the components it needs. Name the single signature detail. **Wait for a yes.**
4. **Set up.** Default stack, unless the project already has one: Next.js, Tailwind, shadcn/ui, Motion, lucide, all via `components`. If the site should be one 3D world rather than a page, switch to `immersive` now. Put palette, type and radius in CSS variables before any section exists.
5. **Build the signature detail first.** It's the riskiest part and everything else has to support it. Use `components` for anything that exists already. Show it running.
6. **Build in phases.** One section or group at a time. After each one, open it on localhost at desktop and phone width and look. Design phones on purpose: don't just stack the desktop layout.
7. **Copy.** Run `human-copy` over every string on the site.
8. **Audit.** Run `audit` and fix what it finds.
9. **Final check.** Keyboard navigation, focus states, `prefers-reduced-motion`, alt text, page title and social image, no console errors. Check Lighthouse if it matters to them.
10. **Save what worked.** Write the recipes that landed (exact values, and why) to memory so the next project starts from them.
11. **Ship.** Push to GitHub and deploy on Vercel when they say so.

## Taking feedback

When they say something looks off, compare against the reference or screenshot and name exact values before changing anything. "Looks AI" is real feedback: run `audit` on that section rather than asking what they mean.
