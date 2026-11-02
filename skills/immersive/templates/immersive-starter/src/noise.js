// Small value-noise fbm: deterministic, so the terrain is the same on every load.
const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const smooth = (t) => t * t * (3 - 2 * t);
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), u = smooth(x - xi), v = smooth(y - yi);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, oct = 6) { let f = 0, a = .5; for (let i = 0; i < oct; i++) { f += a * noise(x, y); x = x * 2.03 + 11; y = y * 2.03 + 7; a *= .5; } return f; }
// ridged peaks, flattened around the hero so it has somewhere to stand
export function terrainHeight(x, z) {
  const r = Math.hypot(x, z), ridge = 1 - Math.abs(2 * fbm(x * .055 + 3, z * .055 + 5) - 1);
  const h = Math.pow(ridge, 1.7) * 8.5 + fbm(x * .22, z * .22) * 2.4 + fbm(x * .9, z * .9, 5) * .75 + fbm(x * 3.1, z * 3.1, 3) * .16 - 4.5;
  const flat = Math.min(1, Math.max(0, (r - 5) / 16));
  return -2 + (h + 2) * flat * flat * (3 - 2 * flat);
}
