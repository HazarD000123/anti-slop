# anti-slop

Same Claude. Different prompt. A Claude Code plugin for building websites that don't look AI-made.

## Install

```
/plugin marketplace add HazarD000123/anti-slop
/plugin install anti-slop@anti-slop
```

## What's inside

| Skill | What it does |
|---|---|
| `/anti-slop:build` | Runs the whole workflow, from brief to deploy, in order |
| `/anti-slop:brief` | Makes Claude decide the point of view, palette, fonts and one signature detail before writing any UI |
| `/anti-slop:match-reference` | Matches a site you love by reading its real CSS instead of guessing from screenshots |
| `/anti-slop:components` | Picks and installs from shadcn/ui, 21st.dev, Magic UI, React Bits and Aceternity UI, then restyles them so they don't look like the demo |
| `/anti-slop:audit` | Finds the tells that make a site look AI-generated, and fixes them |
| `/anti-slop:human-copy` | Rewrites your copy so it sounds like a person and contains only true facts |

## How to use it

```
/anti-slop:build a landing page for my discord bot
```

Claude writes `BRIEF.md`, waits for your yes, and builds in phases, checking each one in a browser. Already have a site? Start with `/anti-slop:audit`.

## Example

`examples/moth` is a three.js landing page built with these skills. Serve the folder (`python3 -m http.server`) and open it; its `BRIEF.md` is the brief it was built from.

## License

MIT
