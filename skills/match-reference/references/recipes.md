# Recipes

Constructions that held up in real projects. Starting points, not rules.

## Glossy button

- No `border`. Edge: `inset 0 0 0 1px rgba(255,255,255,.08)` plus top highlight `inset 0 1px 0 rgba(255,255,255,.20)`.
- `border-radius: 6px`, not a capsule. `height: 26px`, `padding: 0 10px`, `font-size: .75rem`.
- Translucent over blur: `background: rgba(22,27,37,.45)`, `backdrop-filter: blur(12px)`. Opaque kills it.
- Stacked drop shadow that collapses on interaction: 6 layers at rest, 4 plus `translateY(.5px)` on hover, 3 plus `translateY(1px)` when pressed.

## Sliding tab highlight

One element that travels, not a background per button. Render one `<motion.span layoutId="active">` inside the active button. Spring `stiffness: 420, damping: 34`.

## Directional panel slide

Remember where you came from: `dir = next > prev ? 1 : -1`. Enter from `x: dir * 34`, exit to `x: dir * -34`, inside `overflow: hidden`. Animate the wrapper's height too so tabs of different lengths don't jump the page.

## Media row with blurred artwork

48px row, 8px radius, `overflow: hidden`. Behind the content: the artwork at `cover`, `filter: blur(8px) saturate(.8)`, `opacity: .3`, with a `rgba(0,0,0,.2)` scrim. Each row takes its colour from its own art.

## Reveal

`opacity: 0, y: 16` to rest over 0.6s with ease `[0.16, 1, 0.3, 1]`, once. Used everywhere, it stops being noticed, which is the point.

## Framer Motion traps

1. Motion writes an inline `transform`, which overrides CSS centring like `translateX(-50%)`, even when only animating opacity. Centre with layout, or use a plain element.
2. A motion child inherits its parent's variants, and its own `animate` prop stops it running them, so it can stay invisible forever. Split it into an outer element with the variant and an inner one with the numeric animation.
3. `AnimatePresence mode="wait"` unmounts the old child first, so a `useEffect` measures the outgoing panel. Measure with a callback ref.

If content is in the DOM but invisible, check computed `opacity` and `transform` before touching data code.
