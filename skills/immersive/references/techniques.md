# Techniques

Everything here runs in `templates/immersive-starter`, unless it says otherwise.

## Scroll is a timeline

Build one GSAP timeline, scrubbed by ScrollTrigger, that animates a plain `rig` object. Read `rig` every frame in the render loop. Don't drive the camera from scroll position directly, and add pointer and idle sway on top so the camera is never dead still.

```js
const tl = gsap.timeline({ scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1.1 } });
tl.to(rig, { x: 6.5, z: 7.5, duration: 3 }).to(rig, { ca: .009, duration: .35 });
```

Scrub of about 1 gives weight. Vary durations so the journey has fast and slow stretches. Lenis smooths the wheel for the rest.

## Glass and ice without real refraction

Real transmission is costly. Look up a procedural environment with `refract()` at a slightly different index per colour channel, then mix in `reflect()` by a fresnel term. See `crystalShader`. Hard facets and a light inside sell it.

## Particles that become things

Store several target shapes as attributes and mix between them in the vertex shader, staggering each particle by a random value so shapes dissolve rather than crossfade. Sample real models with `MeshSurfaceSampler` from `three/addons/math/MeshSurfaceSampler.js`. Colour and brighten particles by how fast they're moving. Additive points burn out quickly, so scale alpha down as the count goes up.

For hundreds of thousands, or to react to the pointer, simulate on the GPU with `GPUComputationRenderer`. The starter doesn't include this.

## Transitions

Mix two or three: chromatic aberration spiking through the cut, a noise or frost mask, displacement. Make the cut with an object: something breaks, or the camera passes through it.

## Post stack

Using `postprocessing`: bloom with a high threshold so only true highlights glow, vignette, chromatic aberration, a little grain. Use a half-float frame buffer so highlights survive to bloom. Too much bloom is the easiest way to look amateur.

## Micro detail

Add procedural noise to normals and colour in the fragment shader via `onBeforeCompile`. Ground stays crisp up close, with nothing to download. See the terrain material.

## Type in WebGL

Only when the effects need it. igloo draws its UI in WebGL so glitch and scramble effects don't cause layout work. MSDF text via `troika-three-text` is the practical route. Keep real HTML underneath either way. The starter uses HTML with a JS decode, which is enough for most sites.

## Sound

One Web Audio context, started only by a click on a sound toggle. Tie something to motion: map scroll speed to a filter or gain, and trigger effects at transitions. The starter's noise is a placeholder: use real recordings, compressed to OGG or AAC.

## Quality

Choose a tier at load, then watch frame time and lower resolution if frames stay slow. Reduce particle count and terrain segments on the low tier. Test on a real mid-range phone.
