// Kaleid hero crystal: one fullscreen fragment shader, raw WebGL 1, no libraries.
// The crystal is a double-ended hexagonal prism defined by 18 planes. Parallel rays
// are clipped against the planes (no ray marching), refracted per colour channel and
// sent to a plane behind the crystal where the page (headline included) is sampled.

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;        // hero size, CSS px
uniform float uDpr;       // device px per CSS px currently rendered
uniform sampler2D uText;  // headline glyphs, white on transparent, hero-sized
uniform vec2 uTextFx;     // x: alpha, y: vertical offset in CSS px (fade-up)
uniform vec2 uCenter;     // crystal centre, CSS px from hero top-left
uniform float uSize;      // crystal height, CSS px
uniform mat3 uToCrystal;  // view -> crystal space
uniform mat3 uToView;     // crystal -> view space
uniform vec4 uPlanes[18]; // xyz normal (outward), w distance

const vec3 PAGE = vec3(0.0235, 0.0235, 0.0353);
const vec3 INK = vec3(0.953, 0.941, 0.918);
const vec3 WARM = vec3(1.0, 0.753, 0.541);

// Everything behind the crystal, in hero CSS px (y down).
vec3 bg(vec2 px) {
  vec3 col = PAGE;
  vec2 tuv = (px - vec2(0.0, uTextFx.y)) / uRes;
  float a = 0.0;
  if (tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0) a = texture2D(uText, tuv).a;
  col = mix(col, INK, a * uTextFx.x);

  vec2 q = px - uCenter;
  float r2 = dot(q, q) / (uSize * uSize);
  col += WARM * 0.16 * exp(-r2 * 1.6);

  // Spectrum band cast down and to the right of the crystal.
  vec2 dir = normalize(vec2(1.0, 0.62));
  vec2 perp = vec2(-dir.y, dir.x);
  float along = dot(q, dir);
  float across = dot(q, perp);
  float w = uSize * 0.32;
  float t = clamp(across / w * 0.5 + 0.5, 0.0, 1.0);
  vec3 spectrum = 0.5 + 0.5 * cos(6.2831 * (t * 0.85 + vec3(0.0, 0.33, 0.67)));
  float g = exp(-across * across / (2.0 * w * w));
  float fade = smoothstep(uSize * 0.45, uSize * 1.1, along) * exp(-max(along, 0.0) / (uSize * 2.6));
  col += spectrum * g * fade * 0.11;
  return col;
}

// Procedural room reflected in the facets (view space, y up).
vec3 room(vec3 d) {
  vec3 col = vec3(0.018, 0.018, 0.024);
  float up = max(d.y, 0.0);
  col += vec3(1.0, 0.97, 0.92) * 1.6 * exp(-(d.x * d.x * 5.0 + (d.z + 0.15) * (d.z + 0.15) * 7.0)) * smoothstep(0.35, 0.85, up);
  col += WARM * 1.1 * exp(-pow((d.y - 0.08) * 16.0, 2.0)) * smoothstep(0.2, 0.75, d.x);
  col += vec3(0.05, 0.09, 0.17) * smoothstep(0.0, -0.6, d.y);
  return col;
}

// Ray o + t d against the convex hull. Returns (tEnter, tExit, index of entry plane, second-best entry t).
vec4 clip(vec3 o, vec3 d, out int entryIdx) {
  float tIn = -1e9, tIn2 = -1e9, tOut = 1e9;
  entryIdx = 0;
  for (int i = 0; i < 18; i++) {
    vec4 p = uPlanes[i];
    float den = dot(p.xyz, d);
    float num = p.w - dot(p.xyz, o);
    if (abs(den) < 1e-6) {
      if (num < 0.0) return vec4(1.0, -1.0, 0.0, 0.0);
    } else {
      float t = num / den;
      if (den < 0.0) {
        if (t > tIn) { tIn2 = tIn; tIn = t; entryIdx = i; }
        else if (t > tIn2) { tIn2 = t; }
      } else {
        tOut = min(tOut, t);
      }
    }
  }
  return vec4(tIn, tOut, 0.0, tIn2);
}

// Nearest exit plane for a ray starting inside.
float exitHit(vec3 o, vec3 d, out vec3 n) {
  float best = 1e9;
  n = vec3(0.0, 1.0, 0.0);
  for (int i = 0; i < 18; i++) {
    vec4 p = uPlanes[i];
    float den = dot(p.xyz, d);
    if (den > 1e-5) {
      float t = (p.w - dot(p.xyz, o)) / den;
      if (t > 1e-4 && t < best) { best = t; n = p.xyz; }
    }
  }
  return best;
}

// One colour channel through the crystal.
vec3 channel(vec3 P, vec3 d, vec3 N, float ior, float k) {
  vec3 r1 = refract(d, N, 1.0 / ior);
  vec3 Ne;
  float t = exitHit(P, r1, Ne);
  vec3 Q = P + r1 * t;
  vec3 r2 = refract(r1, -Ne, ior);
  if (dot(r2, r2) < 1e-6) return room(uToView * reflect(r1, -Ne));
  vec3 Qv = uToView * Q;
  vec3 r2v = uToView * r2;
  if (r2v.z > -0.05) return room(r2v);
  float s = (Qv.z + 1.7) / -r2v.z;
  vec3 H = Qv + r2v * s;
  return bg(uCenter + vec2(H.x, -H.y) / k);
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  float k = 2.5 / uSize; // crystal units per CSS px (crystal is ~2.5 units tall)
  vec2 l = (px - uCenter) * k;
  if (dot(l, l) > 2.6) { gl_FragColor = vec4(bg(px), 1.0); return; }

  vec3 o = uToCrystal * vec3(l.x, -l.y, 3.0);
  vec3 d = uToCrystal * vec3(0.0, 0.0, -1.0);
  int ei;
  vec4 c = clip(o, d, ei);
  if (c.x >= c.y || c.x < 0.0) { gl_FragColor = vec4(bg(px), 1.0); return; }

  vec3 N = vec3(0.0);
  for (int i = 0; i < 18; i++) if (i == ei) N = uPlanes[i].xyz;
  vec3 P = o + d * c.x;

  vec3 col;
  col.r = channel(P, d, N, 1.46, k).r;
  col.g = channel(P, d, N, 1.505, k).g;
  col.b = channel(P, d, N, 1.55, k).b;

  float cosi = clamp(-dot(d, N), 0.0, 1.0);
  float F = 0.05 + 0.95 * pow(1.0 - cosi, 5.0);
  col = mix(col, room(uToView * reflect(d, N)), F);

  float edge = 1.0 - smoothstep(0.0, 0.035, c.x - c.w);
  col += (vec3(1.0) * 0.35 + WARM * 0.25) * edge;

  // Soft anti-aliased silhouette.
  float aa = smoothstep(0.0, 0.02, c.y - c.x);
  gl_FragColor = vec4(mix(bg(px), col, aa), 1.0);
}
`;

// 6 sides + 6 facets on each tip.
function planes() {
  const out = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    out.push(Math.cos(a), 0, Math.sin(a), 0.42);
  }
  for (const s of [1, -1]) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      const x = Math.cos(a), y = s * 0.9, z = Math.sin(a);
      const len = Math.hypot(x, y, z);
      out.push(x / len, y / len, z / len, 0.836);
    }
  }
  return new Float32Array(out);
}

// 3x3 rotation helpers (row-major arrays, converted to column-major for GL).
const mul = (a, b) => {
  const r = new Array(9).fill(0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) r[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
  return r;
};
const rotX = (a) => [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)];
const rotY = (a) => [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)];
const rotZ = (a) => [Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1];
// Row-major R -> column-major Float32Array of R (for uToView) and of R^T (uToCrystal).
const colMajor = (m) => new Float32Array([m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);
const transposeColMajor = (m) => new Float32Array(m);

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
  return s;
}

// Draw each glyph of the h1 at its laid-out position into a canvas (2x), white on transparent.
function typeset(h1, hero, scale = 2) {
  const heroBox = hero.getBoundingClientRect();
  const cs = getComputedStyle(h1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(heroBox.width * scale));
  canvas.height = Math.max(1, Math.round(heroBox.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  ctx.fillStyle = '#fff';
  const ascent = ctx.measureText('Ag').fontBoundingBoxAscent;

  const glyphs = [];
  const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent;
    for (let i = 0; i < text.length; i++) {
      // Surrogate pairs stay together.
      const cp = text.codePointAt(i);
      const len = cp > 0xffff ? 2 : 1;
      range.setStart(node, i);
      range.setEnd(node, i + len);
      const r = range.getBoundingClientRect();
      const ch = text.slice(i, i + len);
      i += len - 1;
      if (!r.width || !ch.trim()) continue;
      const x = r.left - heroBox.left;
      const y = r.top - heroBox.top;
      ctx.fillText(ch, x, y + ascent);
      glyphs.push({ x, y, w: r.width, h: r.height });
    }
  }
  return { canvas, glyphs };
}

// Rest position: over the right ends of headline lines 1 and 2.
function restFrom(glyphs) {
  const lines = [];
  for (const g of glyphs) {
    const line = lines.find((l) => Math.abs(l.y - g.y) < g.h * 0.4);
    if (line) line.items.push(g);
    else lines.push({ y: g.y, items: [g] });
  }
  lines.sort((a, b) => a.y - b.y);
  if (lines.length === 0) return null;
  const ends = lines.slice(0, 2).map((l) => {
    const last = l.items.reduce((a, b) => (b.x > a.x ? b : a));
    return { x: last.x + last.w, y: last.y + last.h / 2 };
  });
  const x = ends.reduce((s, e) => s + e.x, 0) / ends.length;
  const y = ends.reduce((s, e) => s + e.y, 0) / ends.length;
  return { x, y };
}

export function startCrystal({ hero, canvas, h1 }) {
  if (typeof location !== 'undefined' && location.search.includes('nogl')) return () => {};

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) return () => {};

  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link failed');
  } catch (e) {
    console.warn('[kaleid] WebGL disabled:', e.message);
    return () => {};
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {};
  for (const n of ['uRes', 'uDpr', 'uText', 'uTextFx', 'uCenter', 'uSize', 'uToCrystal', 'uToView', 'uPlanes'])
    u[n] = gl.getUniformLocation(prog, n);
  gl.uniform4fv(u.uPlanes, planes());
  gl.uniform1i(u.uText, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('has-gl');

  // Once torn down or the GPU drops the context, nothing may touch GL again,
  // and the h1 must become visible text again.
  let dead = false;
  const onLost = () => {
    dead = true;
    setRunning(false);
    canvas.style.visibility = 'hidden'; // a lost context paints blank; show the page behind it
    document.documentElement.classList.remove('has-gl');
  };
  canvas.addEventListener('webglcontextlost', onLost);

  // ---- layout-derived state ----
  let W = 1, H = 1, size = 100, rest = { x: 0, y: 0 };
  let dprScale = 1;
  const maxDpr = () => Math.min(window.devicePixelRatio || 1, 1.75);

  function layout() {
    if (dead) return;
    const box = hero.getBoundingClientRect();
    W = box.width;
    H = box.height;
    const portrait = innerHeight > innerWidth;
    size = innerHeight * (portrait ? 0.13 : 0.25);
    const { canvas: textCanvas, glyphs } = typeset(h1, hero);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    const r = restFrom(glyphs);
    // Nudge left so the last letters sit inside the crystal, not beside it.
    if (r) rest = { x: r.x - size * 0.12, y: r.y };
    resizeCanvas();
    if (!running) draw(performance.now());
  }

  function resizeCanvas() {
    const dpr = maxDpr() * dprScale;
    const w = Math.max(1, Math.round(W * dpr));
    const h = Math.max(1, Math.round(H * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  // ---- motion state ----
  const t0 = performance.now();
  const pos = { x: 0, y: 0, vx: 0, vy: 0, init: false };
  const scale = { v: reduced ? 1 : 0.5, vel: 0 };
  let pointer = null; // hero coords
  let spin = 0.6, spinVel = 0.34;
  let last = t0;

  function onMove(e) {
    const box = hero.getBoundingClientRect();
    const p = { x: e.clientX - box.left, y: e.clientY - box.top };
    if (pointer && e.pointerType !== 'touch') {
      const dx = p.x - pointer.x;
      spinVel = Math.max(-14, Math.min(14, spinVel + dx * 0.012));
    }
    pointer = p;
  }
  // Touch: forget the finger when it lifts or the browser takes over to scroll.
  // Mouse: forget it when it leaves the window (pointerout with no related target).
  const onEnd = (e) => {
    if (e.pointerType === 'touch' || e.type === 'pointercancel') pointer = null;
  };
  const onOut = (e) => {
    if (!e.relatedTarget) pointer = null;
  };
  if (!reduced) {
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerup', onEnd, { passive: true });
    addEventListener('pointercancel', onEnd, { passive: true });
    addEventListener('pointerout', onOut, { passive: true });
  }

  function step(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    const t = (now - t0) / 1000;

    if (!pos.init) Object.assign(pos, { x: rest.x, y: rest.y, init: true });

    if (!reduced) {
      // Follow a third of the way to the pointer on a spring (38, 8).
      const tx = pointer ? rest.x + (pointer.x - rest.x) / 3 : rest.x;
      const ty = pointer ? rest.y + (pointer.y - rest.y) / 3 : rest.y;
      pos.vx += (-38 * (pos.x - tx) - 8 * pos.vx) * dt;
      pos.vy += (-38 * (pos.y - ty) - 8 * pos.vy) * dt;
      pos.x += pos.vx * dt;
      pos.y += pos.vy * dt;

      // Grow from half size on a spring (60, 9), starting 0.5 s in.
      if (t > 0.5) {
        scale.vel += (-60 * (scale.v - 1) - 9 * scale.vel) * dt;
        scale.v += scale.vel * dt;
      }

      // Spin decays back to a slow 0.34 rad/s.
      spinVel = 0.34 + (spinVel - 0.34) * Math.exp(-dt * 1.6);
      spin += spinVel * dt;
    } else {
      Object.assign(pos, { x: rest.x, y: rest.y });
    }
    return t;
  }

  function draw(now) {
    if (dead) return;
    const t = reduced ? 10 : step(now);
    if (reduced) step(now);
    const bob = reduced ? 0 : Math.sin(t * 1.25) * size * 0.025;
    const sink = scrollY * 0.35;
    const cx = pos.x;
    const cy = pos.y + bob + sink;

    const leanToward = 0.32 + Math.max(-0.35, Math.min(0.35, pos.vy * 0.0016));
    const leanSide = -0.2 + Math.max(-0.4, Math.min(0.4, -pos.vx * 0.0016));
    const R = mul(rotZ(leanSide), mul(rotX(leanToward), rotY(spin)));

    const fadeT = reduced ? 1 : Math.min(1, t / 1.1);
    const ease = 1 - Math.pow(1 - fadeT, 3);

    gl.uniform2f(u.uRes, W, H);
    gl.uniform1f(u.uDpr, canvas.width / W);
    gl.uniform2f(u.uTextFx, ease, (1 - ease) * 26);
    gl.uniform2f(u.uCenter, cx, cy);
    gl.uniform1f(u.uSize, size * Math.max(0.05, scale.v));
    gl.uniformMatrix3fv(u.uToView, false, colMajor(R));
    gl.uniformMatrix3fv(u.uToCrystal, false, transposeColMajor(R));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // ---- loop, adaptive resolution, visibility ----
  // Frame time is judged against the display's own cadence (`base`), so a 30 Hz
  // or Low Power Mode display isn't mistaken for a slow GPU.
  let running = false, raf = 0, slow = 0, fast = 0, prev = 0, base = 1000 / 60;
  function frame(now) {
    if (!running) return;
    const ft = prev ? now - prev : base;
    prev = now;
    base = Math.min(base * 1.002, Math.max(ft, 4)); // tracks the shortest recent interval, drifts up slowly
    if (ft > base * 1.4) { fast = 0; if (++slow > 8 && dprScale > 0.45) { dprScale *= 0.85; slow = 0; resizeCanvas(); } }
    else if (ft < base * 1.15) { slow = 0; if (++fast > 180 && dprScale < 1) { dprScale = Math.min(1, dprScale * 1.08); fast = 0; resizeCanvas(); } }
    draw(now);
    raf = requestAnimationFrame(frame);
  }
  function setRunning(on) {
    if (dead) on = false;
    if (reduced || on === running) return;
    running = on;
    prev = 0;
    last = performance.now();
    if (on) raf = requestAnimationFrame(frame);
    else cancelAnimationFrame(raf);
  }

  const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting && !document.hidden));
  io.observe(hero);
  const onVis = () => setRunning(!document.hidden && hero.getBoundingClientRect().bottom > 0);
  document.addEventListener('visibilitychange', onVis);

  let roRaf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(roRaf);
    roRaf = requestAnimationFrame(layout);
  });
  ro.observe(hero);
  layout();
  document.fonts?.ready.then(() => layout());
  const onScrollStill = () => draw(performance.now());
  if (reduced) addEventListener('scroll', onScrollStill, { passive: true });

  return () => {
    setRunning(false);
    dead = true; // also stops a pending fonts.ready / ResizeObserver layout()
    cancelAnimationFrame(roRaf);
    io.disconnect();
    ro.disconnect();
    canvas.removeEventListener('webglcontextlost', onLost);
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerup', onEnd);
    removeEventListener('pointercancel', onEnd);
    removeEventListener('pointerout', onOut);
    removeEventListener('scroll', onScrollStill);
    document.removeEventListener('visibilitychange', onVis);
    document.documentElement.classList.remove('has-gl');
    // Context is kept: React StrictMode re-runs effects on the same canvas in dev.
  };
}
