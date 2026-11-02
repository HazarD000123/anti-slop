import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer, RenderPass, EffectPass, BloomEffect, ChromaticAberrationEffect, NoiseEffect, VignetteEffect, BlendFunction } from 'postprocessing';
import '@fontsource-variable/martian-mono/wdth.css';
import './style.css';
import { terrainHeight } from './noise.js';
import { skyShader, crystalShader, particleShader } from './shaders.js';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const low = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4; // quality tier, refined at runtime below
const $ = (s) => document.querySelector(s);

const renderer = new THREE.WebGLRenderer({ canvas: $('#gl'), powerPreference: 'high-performance', antialias: false, stencil: false, depth: true });
if (!renderer.getContext()) throw new Error('WebGL unavailable: the HTML content stays readable');
let dpr = Math.min(devicePixelRatio, low ? 2 : 2.5); // sharp by default; the adaptive check below lowers it only if frames really suffer
renderer.setPixelRatio(dpr);
const scene = new THREE.Scene();
const FOG = new THREE.Color(0x121c26);
scene.fog = new THREE.FogExp2(FOG, 0.038);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400);

// --- sky ---
const sky = new THREE.Mesh(new THREE.SphereGeometry(180, 32, 16), new THREE.ShaderMaterial({ ...skyShader, side: THREE.BackSide, depthWrite: false, fog: false }));
scene.add(sky);

// --- terrain: replace with your own Draco-compressed model (references/assets.md) ---
const SEG = low ? 360 : 800;
const terrainGeo = new THREE.PlaneGeometry(120, 120, SEG, SEG).rotateX(-Math.PI / 2);
const tp = terrainGeo.attributes.position;
for (let i = 0; i < tp.count; i++) tp.setY(i, terrainHeight(tp.getX(i), tp.getZ(i)));
terrainGeo.computeVertexNormals();
const terrain = new THREE.Mesh(terrainGeo, (() => {
  const mat = new THREE.MeshStandardMaterial({ color: 0x8fa3b4, roughness: .9, metalness: 0 });
  // micro detail in the fragment shader: keeps ground crisp up close at any resolution, with no texture to download
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWorld;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWorld = (modelMatrix * vec4(position, 1.)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vWorld;
      float dh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float dn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(dh(i),dh(i+vec2(1,0)),f.x),mix(dh(i+vec2(0,1)),dh(i+vec2(1,1)),f.x),f.y);}
      float dfbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*dn(p);p=p*2.1+7.;a*=.5;}return v;}`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      { float e=.035,s=vWorld.y; vec2 w=vWorld.xz*vec2(2.6); float h0=dfbm(w),hx=dfbm(w+vec2(e*2.6,0.)),hz=dfbm(w+vec2(0.,e*2.6));
        vec3 g=normalize(vec3((h0-hx)/e*.075,1.,(h0-hz)/e*.075)); normal=normalize(normal+(viewMatrix*vec4(g-vec3(0.,1.,0.),0.)).xyz);
        diffuseColor.rgb*=.8+.42*dfbm(vWorld.xz*.55)+.16*dn(vWorld.xz*42.); }`);
  };
  return mat;
})());
scene.add(terrain);
scene.add(new THREE.HemisphereLight(0x9fb8cc, 0x10161c, .75));
const moon = new THREE.DirectionalLight(0xcfe2f2, 1.5); moon.position.set(-22, 18, -12); scene.add(moon);
const glow = new THREE.PointLight(0xffb066, 60, 26, 1.7); scene.add(glow);

// --- hero: replace with your real model; keep the shader idea (fresnel + split-channel refraction) ---
const HERO = new THREE.Vector3(0, terrainHeight(0, 0) + 4.2, 0);
// a grown cluster of hexagonal crystals, seeded so it's the same every load
const heroGeo = (() => {
  let s = 41; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const parts = [], up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), M = new THREE.Matrix4();
  for (let i = 0; i < (low ? 46 : 96); i++) {
    const big = i < 12, len = big ? 1.6 + r() * 1.5 : .45 + r() * 1.05, rad = big ? .17 + r() * .22 : .05 + r() * .13;
    const shaft = new THREE.CylinderGeometry(rad, rad * (.72 + r() * .2), len, 6, 1).translate(0, len / 2, 0);
    const tip = new THREE.ConeGeometry(rad, rad * (1.5 + r() * 1.6), 6, 1).translate(0, len + rad * .75, 0);
    const g = mergeGeometries([shaft.toNonIndexed(), tip.toNonIndexed()]);
    const d = new THREE.Vector3(r() * 2 - 1, (big ? .25 : -.25) + r() * 1.3 * (r() > .22 ? 1 : -1), r() * 2 - 1).normalize();
    q.setFromUnitVectors(up, d); M.compose(d.clone().multiplyScalar(.1 + r() * .22), q, new THREE.Vector3(1, 1, 1));
    parts.push(g.applyMatrix4(M));
  }
  const g = mergeGeometries(parts); g.computeVertexNormals(); return g;
})();
const heroMat = new THREE.ShaderMaterial({ ...crystalShader, uniforms: { uTime: { value: 0 }, uFade: { value: 1 } }, transparent: true });
const hero = new THREE.Mesh(heroGeo, heroMat); hero.position.copy(HERO); scene.add(hero);
const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.2, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.65, .7) })); core.position.copy(HERO); scene.add(core);

// --- particles: three GPU-morphed shapes. Sample a real model's surface for your own (MeshSurfaceSampler) ---
const N = low ? 110000 : 360000;
const pos = new Float32Array(N * 3), a = new Float32Array(N * 3), b = new Float32Array(N * 3), rand = new Float32Array(N);
const knot = new THREE.TorusKnotGeometry(3.1, .85, 256, 32, 2, 3).attributes.position;
for (let i = 0; i < N; i++) {
  const u = Math.random() * 2 - 1, th = Math.random() * 6.283, s = Math.sqrt(1 - u * u), r = 1.2 + Math.random() * .7;
  pos[i*3] = HERO.x + s * Math.cos(th) * r; pos[i*3+1] = HERO.y + u * r * 1.55; pos[i*3+2] = HERO.z + s * Math.sin(th) * r;
  const k = (Math.random() * knot.count) | 0;
  a[i*3] = HERO.x + knot.getX(k) + (Math.random() - .5) * .3; a[i*3+1] = HERO.y + 3 + knot.getY(k) + (Math.random() - .5) * .3; a[i*3+2] = HERO.z + knot.getZ(k) + (Math.random() - .5) * .3;
  const ga = Math.random() * 6.283, gr = 2 + Math.pow(Math.random(), .6) * 11, arm = Math.sin(ga * 3 + gr * .9) * .7;
  b[i*3] = HERO.x + Math.cos(ga + arm) * gr; b[i*3+1] = HERO.y + 7 + (Math.random() - .5) * .9 * (1.4 - gr / 12); b[i*3+2] = HERO.z + Math.sin(ga + arm) * gr;
  rand[i] = Math.random();
}
const pg = new THREE.BufferGeometry();
pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('aA', new THREE.BufferAttribute(a, 3)); pg.setAttribute('aB', new THREE.BufferAttribute(b, 3)); pg.setAttribute('aR', new THREE.BufferAttribute(rand, 1));
const pMat = new THREE.ShaderMaterial({ ...particleShader, uniforms: { uTime: { value: 0 }, uA: { value: 0 }, uB: { value: 0 }, uShow: { value: 0 }, uPx: { value: dpr }, uPointer: { value: new THREE.Vector3(0, -99, 0) } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
const points = new THREE.Points(pg, pMat); points.frustumCulled = false; scene.add(points);

// --- post stack ---
const composer = new EffectComposer(renderer, { frameBufferType: THREE.HalfFloatType, multisampling: Math.min(renderer.capabilities.maxSamples, low ? 2 : 4) }); // MSAA keeps edges sharp through post
composer.addPass(new RenderPass(scene, camera));
const ca = new ChromaticAberrationEffect({ offset: new THREE.Vector2(.0004, .0004), radialModulation: true, modulationOffset: .25 });
const noise = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY }); noise.blendMode.opacity.value = .14;
composer.addPass(new EffectPass(camera, new BloomEffect({ intensity: .7, luminanceThreshold: .82, luminanceSmoothing: .3, mipmapBlur: true }), new VignetteEffect({ offset: .3, darkness: .62 })));
composer.addPass(new EffectPass(camera, ca, noise));

// --- the journey: one GSAP timeline scrubbed by scroll. Storyboard here first, with grey shapes. ---
const rig = { x: -3.5, y: HERO.y + 5.5, z: 24, tx: 0, ty: HERO.y - .4, tz: 0, ca: .0004, fade: 1, glow: 1 };
const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' }, scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: reduce ? false : 1.1 } });
tl.to(rig, { x: 6.5, y: HERO.y + 1.2, z: 7.5, ty: HERO.y, duration: 3 })
  .to(rig, { x: -5.5, z: 6, y: HERO.y + .2, duration: 2 })
  // the break: hero fades as particles take over, with a burst of aberration selling the cut
  .to(rig, { ca: .009, duration: .35, ease: 'power2.in' })
  .to(rig, { fade: 0, duration: .35, ease: 'power3.in' }, '<')
  .to(pMat.uniforms.uShow, { value: 1, duration: .25, ease: 'none' }, '<')
  .to(rig, { ca: .0007, duration: .9, ease: 'power3.out' })
  .to(pMat.uniforms.uA, { value: 1, duration: 1.1, ease: 'power2.inOut' }, '<')
  .to(rig, { x: 8, y: HERO.y + 4.5, z: 12, ty: HERO.y + 3, duration: 1.8 }, '<')
  .to(pMat.uniforms.uB, { value: 1, duration: 1.6, ease: 'power2.inOut' })
  .to(rig, { x: 0, y: HERO.y + 22, z: 15, tx: 0, ty: HERO.y + 6.4, duration: 2.1 }, '<');

// --- content reveals, sound, pointer ---
// text decodes in: type is part of the world, and a11y keeps the real string in the DOM from the start
const GLYPHS = '/\\\\|_-+:.#';
function decode(el) {
  if (reduce || el.children.length) return;
  const txt = el.textContent, t0 = performance.now(), D = Math.min(900, 260 + txt.length * 16);
  el.setAttribute('aria-label', txt);
  (function step(n) {
    const u = (n - t0) / D, shown = Math.floor(u * txt.length);
    el.textContent = txt.split('').map((c, i) => i < shown || c === ' ' ? c : GLYPHS[(i * 7 + Math.floor(n / 45)) % GLYPHS.length]).join('');
    if (u < 1) requestAnimationFrame(step); else { el.textContent = txt; el.removeAttribute('aria-label'); }
  })(t0);
}
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); decode(e.target); io.unobserve(e.target); } }), { threshold: .2 });
document.querySelectorAll('.rv').forEach((e) => io.observe(e));
const ptr = new THREE.Vector2(0, 0); addEventListener('pointermove', (e) => { ptr.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1)); });

// shortcut: filtered noise stands in for real audio, replace it with your own tracks in public/audio
let audio = null;
$('#sound').addEventListener('click', (e) => {
  if (!audio) {
    const ctx = new AudioContext(), buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 340; const g = ctx.createGain(); g.gain.value = 0;
    src.connect(lp).connect(g).connect(ctx.destination); src.start(); audio = { ctx, lp, g, on: false };
  }
  audio.on = !audio.on; audio.ctx.resume();
  audio.g.gain.linearRampToValueAtTime(audio.on ? .12 : 0, audio.ctx.currentTime + .5);
  e.target.textContent = `Sound: ${audio.on ? 'on' : 'off'}`; e.target.setAttribute('aria-pressed', audio.on);
});

function resize() { const w = innerWidth, h = innerHeight; composer.setSize(w, h); camera.aspect = w / h; camera.fov = w < h ? 58 : 42; camera.updateProjectionMatrix(); pMat.uniforms.uPx.value = dpr * (w < h ? .8 : 1); }
addEventListener('resize', resize); resize();

const lenis = reduce ? null : new Lenis({ lerp: .085 });
if (lenis) lenis.on('scroll', ScrollTrigger.update);

const timer = new THREE.Timer(); timer.connect(document);
let slow = 0, frames = 0;
const tele = $('#tele'); // live camera position: a real readout, not decoration
function frame(ms) {
  timer.update(ms); const t = timer.getElapsed(), dt = timer.getDelta();
  if (lenis) lenis.raf(ms);
  // adaptive quality: sustained slow frames lower the resolution instead of stuttering
  if (dt > 1 / 40) slow++; if (++frames >= 90) { if (slow > 45 && dpr > 1) { dpr = Math.max(1, dpr - .25); renderer.setPixelRatio(dpr); resize(); } frames = slow = 0; }
  const sway = reduce ? 0 : 1;
  camera.position.set(rig.x + ptr.x * .35 * sway + Math.sin(t * .3) * .12 * sway, rig.y + ptr.y * .2 * sway + Math.cos(t * .23) * .08 * sway, rig.z);
  camera.lookAt(rig.tx, rig.ty, rig.tz);
  heroMat.uniforms.uTime.value = t; heroMat.uniforms.uFade.value = rig.fade; hero.visible = rig.fade > .01; core.visible = hero.visible; hero.rotation.y = t * .14; core.scale.setScalar(rig.fade);
  glow.position.copy(HERO); glow.intensity = 60 * Math.max(rig.fade, .12);
  pMat.uniforms.uTime.value = t; points.visible = pMat.uniforms.uShow.value > .001;
  ca.offset.set(rig.ca, rig.ca * .6);
  if (frames % 4 === 0) tele.textContent = `X ${camera.position.x.toFixed(2).padStart(7)}  Y ${camera.position.y.toFixed(2).padStart(7)}  Z ${camera.position.z.toFixed(2).padStart(7)}\nPATH ${String(Math.round(tl.progress() * 100)).padStart(3, '0')}%`;
  composer.render(dt);
  requestAnimationFrame(frame);
}

// compile before the reveal so the first scroll doesn't hitch
const pct = $('#pct'); pct.textContent = '60%';
renderer.compile(scene, camera);
pct.textContent = '100%';
requestAnimationFrame((ms) => { frame(ms); $('#loader').classList.add('done'); ScrollTrigger.refresh(); });
