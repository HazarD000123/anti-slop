---
name: match-reference
description: Match the feel of a website someone admires by reading its real HTML and CSS instead of guessing from screenshots. Use when given a reference site, a saved page, or a screenshot to look like, or told "make it like this" or "that's not what it looks like".
---

# Match a reference from its source

Screenshots make you guess. Guessing gets radii, shadows and opacity measurably wrong. Read the real values.

1. **Get the source.** Ask for the page saved with "Save Page As" (the `.html` and its `_files` folder), or fetch the URL if it's public.
2. **Measure what the person pointed at.** Find the component's class string in the HTML and the custom properties in the CSS. Use Python for large HTML files: long `grep -oE` patterns backtrack badly and time out. Write down exact values:
   - border radius, height, padding, gap
   - every shadow layer, including inset rings and top-edge highlights
   - background opacity and blur
   - font family, size, weight, tracking
   - easing, duration, spring settings
   - hover and active states, which is where most of the feel lives
3. **Rebuild the construction, not the identity.** Take measurements and techniques. Don't copy the words, logo, images or layout wholesale. Copy stays the user's own, and the result should be recognisably theirs.
4. **Compare side by side.** Screenshot yours next to the reference at the same size. Name each remaining difference. If you deviate on purpose because their content differs, say so.
5. **Keep what worked.** Save the recipe (exact values and why) so the next project starts from it.

Describe differences precisely: "rounded rectangle, not capsule", "translucent, not opaque", "glow only on buttons".

See `references/recipes.md` for proven constructions.
