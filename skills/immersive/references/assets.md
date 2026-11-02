# Assets

For scale, igloo.inc loads about 45 KTX2 textures (around 11MB), 20 Draco meshes, 18 OGG audio tracks (around 3MB) and one EXR, using workers for decoding. It's heavy, and it's still compressed hard.

## Where models come from

- **Blender** for most work. Houdini if you need procedural systems.
- **Poly Haven** (https://polyhaven.com) has CC0 textures, HDRIs and models.
- Anything else: check the licence allows commercial use on the web, and keep a record of it.
- Never rip assets from another site, or use "recreation" repos of one.

## Compress every model

```bash
npx @gltf-transform/cli optimize input.glb public/models/output.glb --compress draco --texture-compress ktx2
```

`--texture-compress ktx2` needs KTX-Software installed; use `webp` if it isn't. Add `--simplify true --simplify-ratio 0.5` for over-detailed meshes.

## Load them

Copy the decoders from `node_modules/three/examples/jsm/libs/` (`draco/` and `basis/`) into `public/`.

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

const manager = new THREE.LoadingManager();
manager.onProgress = (_, done, total) => { pct.textContent = `${Math.round(done / total * 100)}%`; };
const draco = new DRACOLoader(manager).setDecoderPath('/draco/');
const ktx2 = new KTX2Loader(manager).setTranscoderPath('/basis/').detectSupport(renderer);
const gltf = new GLTFLoader(manager).setDRACOLoader(draco).setKTX2Loader(ktx2);
const model = await gltf.loadAsync('/models/output.glb');
```

## Load order

1. First view only, behind the preloader. Keep it small.
2. Call `renderer.compile(scene, camera)` before revealing, so the first scroll doesn't hitch.
3. Load later scenes in the background, and compile them ahead of the transition that needs them.

Check the real transfer size in the browser's network tab. Serve with Brotli, and cache assets for a long time.
