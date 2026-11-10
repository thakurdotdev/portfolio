/*
 * The dots are simulated on the GPU. Two textures hold every dot's position (xyz, opacity)
 * and velocity (xyz, size). Each frame, every dot is pulled by a spring towards its place
 * in the current scene's shape, swirls while it is far from it, and is pushed and stirred
 * by the pointer. So a shape forms on its own time once a scene starts, and nothing pops
 * when scenes change halfway through a move.
 *
 * Each scene's shape is a function from a dot's random seed (and the time) to a point in a
 * unit-sized space. Kinds (keep in sync with KINDS in engine.ts):
 *   0 scatter    1 portrait   2 wormhole   3 supervisor   4 wave
 *   5 layers     6 terrain    7 orbit      8 sphere
 */

const FORMS = /* glsl */ `
uniform float uTime;
uniform float uN;
uniform float uHi;      // highlighted satellite, -1 for none
uniform float uGrid;    // portrait grid cells across the stage
uniform float uWpp;     // world units per CSS pixel
uniform float uSize;    // base dot size, CSS px
uniform vec2 uRot;      // yaw, pitch from the pointer and dragging
uniform int uKindA;
uniform int uKindB;
uniform vec3 uStageA;   // xy: centre, z: radius, world units
uniform vec3 uStageB;
uniform float uAlphaA;
uniform float uAlphaB;
uniform float uSwitch;  // when the current scene started
uniform sampler2D tSeed;
uniform sampler2D tExtra;
uniform sampler2D tPortrait;

const float TAU = 6.28318530718;

vec4 sd;          // random seeds
vec4 ex;          // x: dust test, y: delay, z: spare, w: stiffness
vec4 pt;          // portrait: xyz, tone (-1 when unused)
float aId;
float gRadius;

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

vec3 sphereDir(float u, float v) {
  float z = u * 2.0 - 1.0;
  float r = sqrt(max(0.0, 1.0 - z * z));
  float a = v * TAU;
  return vec3(r * cos(a), z, r * sin(a));
}

vec3 fibonacci(float i, float n) {
  float k = i + 0.5;
  float y = 1.0 - 2.0 * k / n;
  float r = sqrt(max(0.0, 1.0 - y * y));
  float a = k * 2.39996323;
  return vec3(r * cos(a), y, r * sin(a));
}

/* A point in the unit space of shape k at time t, with a size and opacity multiplier. */
vec3 form(int k, float t, out float s, out float a) {
  s = 1.0;
  a = 1.0;

  if (k == 1) {
    // The photo as a halftone on a relief: like pin art, the light pushes the pins out.
    if (pt.w < 0.0) {
      s = 0.0; a = 0.0;
      return vec3(0.0, -0.3, 0.0);
    }
    float cellPx = (gRadius * 2.0 / uGrid) / uWpp;
    s = (0.2 + 0.95 * sqrt(pt.w)) * cellPx / uSize;
    vec3 p = pt.xyz;
    p.z += sin(t * 1.1 + p.y * 3.0 + p.x * 2.0) * 0.012;
    return p;
  }

  if (k == 2) {
    // Tunl: a wormhole. Traffic squeezes through the throat from localhost to the world.
    float spd = 0.085;
    bool ring = sd.w < 0.72;
    float along = ring ? fract((floor(sd.z * 44.0) + 0.5) / 44.0 + t * spd) : fract(sd.y + t * spd * 1.8);
    float x = (along - 0.5) * 2.5;
    float r = 0.13 * sqrt(1.0 + (x * x) / 0.042);
    float th = sd.x * TAU + x * 1.1 + t * 0.15;
    vec3 p = vec3(x, cos(th) * r, sin(th) * r);
    a = (1.0 - smoothstep(0.78, 1.0, abs(along - 0.5) * 2.0)) * (ring ? 0.85 : 1.0);
    s = ring ? 0.8 : 1.25;
    return rotY(-0.55) * rotZ(0.1) * p;
  }

  if (k == 3) {
    // pm0: a daemon and its processes. Heartbeats run out along the spokes; every few
    // seconds one process dies and is brought back.
    float nodes = 10.0;
    float nd = floor(sd.x * nodes);
    float ang = nd / nodes * TAU;
    vec3 np = vec3(cos(ang), 0.0, sin(ang)) * 0.8;
    float cyc = t / 2.4;
    float crashed = mod(floor(cyc), nodes);
    float ph = fract(cyc);
    float isCrash = 1.0 - step(0.5, abs(nd - crashed));
    float gone = isCrash * smoothstep(0.05, 0.16, ph) * (1.0 - smoothstep(0.5, 0.75, ph));
    vec3 p;
    if (sd.z < 0.18) {
      float beat = pow(abs(sin(t * 2.4)), 10.0);
      p = sphereDir(sd.y, sd.w) * 0.16 * (1.0 + beat * 0.12);
      s = 0.95;
      a = 1.0;
    } else if (sd.z < 0.42) {
      float u = sd.y;
      p = np * mix(0.22, 0.9, u);
      float pu = fract(t * 0.75 + nd * 0.37);
      float glow = exp(-pow((u - pu) * 8.0, 2.0));
      s = 0.5 + glow * 1.2;
      a = (0.22 + glow * 0.78) * (1.0 - gone);
    } else if (sd.z < 0.5) {
      float an = sd.y * TAU;
      p = vec3(cos(an), 0.0, sin(an)) * 0.8;
      s = 0.45;
      a = 0.2;
    } else {
      vec3 dir = sphereDir(sd.y, sd.w);
      p = np + dir * (0.075 + gone * 0.5);
      s = 1.0;
      a = 1.0 - gone;
    }
    return rotX(0.9) * rotY(t * 0.08) * p;
  }

  if (k == 4) {
    // SyncVibe: two sources playing in sync, their ripples crossing on a membrane.
    float rr = sqrt((aId + 0.5) / uN) * 1.1;
    float th = aId * 2.39996323;
    vec2 q = vec2(cos(th), sin(th)) * rr;
    float d1 = length(q - vec2(-0.36, 0.0));
    float d2 = length(q - vec2(0.36, 0.0));
    float h = (sin(d1 * 15.0 - t * 3.0) + sin(d2 * 15.0 - t * 3.0)) * 0.5;
    float fall = 1.0 - smoothstep(0.55, 1.1, rr);
    vec3 p = vec3(q.x, h * 0.12 * (0.35 + fall), q.y);
    s = 0.6 + max(h, 0.0) * 0.75;
    a = (0.3 + max(h, 0.0) * 0.7) * (0.3 + fall * 0.7);
    return rotX(-0.95) * rotY(t * 0.05) * p;
  }

  if (k == 5) {
    // ShipYard: a build. Layers drop onto the stack one by one, then the image ships.
    float L = floor(sd.x * 6.0);
    float ph = fract(t / 7.0);
    float land = 0.06 + L * 0.1;
    float drop = smoothstep(land - 0.07, land, ph);
    float lift = smoothstep(0.84, 1.0, ph);
    float y = -0.55 + L * 0.2 + (1.0 - drop) * 1.2 + lift * lift * 1.8;
    vec2 g;
    bool edge = sd.w < 0.4;
    if (edge) {
      float side = floor(sd.z * 4.0);
      float u = sd.y;
      g = side < 1.0 ? vec2(u, 0.0) : side < 2.0 ? vec2(u, 1.0) : side < 3.0 ? vec2(0.0, u) : vec2(1.0, u);
    } else {
      g = vec2(floor(sd.y * 22.0) / 21.0, floor(sd.z * 15.0) / 14.0);
    }
    g -= 0.5;
    vec3 p = vec3(g.x * 1.25, y, g.y * 0.85);
    a = drop * (1.0 - lift) * (edge ? 1.0 : 0.5);
    s = edge ? 0.9 : 0.7;
    return rotX(0.5) * rotY(0.7 + t * 0.05) * p;
  }

  if (k == 6) {
    // Experience: a landscape you travel over.
    float cols = 150.0;
    float rows = floor(uN / cols);
    float gx = mod(aId, cols) / (cols - 1.0);
    float gz0 = floor(aId / cols) / rows;
    float travel = t * 0.012;
    float gz = fract(gz0 + travel);
    float x = (gx - 0.5) * 7.0;
    float z = mix(-6.0, 1.4, gz);
    float ground = (gz0 - floor(gz0 + travel)) * 12.0;
    float hh = noise(vec2(x * 0.55, ground));
    hh = hh * hh * 1.1 + noise(vec2(x * 1.7, gz0 * 31.0)) * 0.12;
    a = smoothstep(0.0, 0.3, gz) * (1.0 - smoothstep(0.85, 1.0, gz)) * (0.35 + hh * 0.65);
    s = 0.75;
    return vec3(x, -1.25 + hh * 0.55, z);
  }

  if (k == 7) {
    // The server: a core and fourteen processes in orbit. The first eight are mine.
    float sat = mod(aId, 14.0);
    float mine = step(sat, 7.5);
    float hi = 1.0 - step(0.5, abs(sat - uHi));
    vec3 p;
    if (sd.z < 0.3) {
      p = sphereDir(sd.x, sd.y) * (0.26 + 0.02 * sd.w);
      p *= 1.0 + 0.04 * sin(t * 2.0);
      s = 0.8;
      a = 0.9;
    } else {
      float rad = 0.5 + 0.5 * fract(sat * 0.618034 + 0.11);
      float inc = (fract(sat * 0.381966 + 0.3) - 0.5) * 2.0;
      float node = fract(sat * 0.754877) * TAU;
      float ang;
      vec3 local = vec3(0.0);
      if (sd.z < 0.6) {
        ang = sd.x * TAU;
        s = 0.5;
        a = mix(0.14, 0.3, mine) + hi * 0.45;
      } else {
        ang = sat * 1.37 + t * (0.3 / rad);
        local = sphereDir(sd.x, sd.y) * mix(0.03, 0.055, mine) * (1.0 + hi * 1.4);
        s = mix(0.7, 1.1, mine) + hi * 0.5;
        a = mix(0.35, 1.0, mine);
      }
      p = rotY(node) * rotX(inc) * vec3(cos(ang) * rad, 0.0, sin(ang) * rad) + local;
    }
    return rotX(0.3) * rotZ(-0.12) * p;
  }

  if (k == 8) {
    // Contact: everything folds back into one dot, which beats.
    vec3 d = fibonacci(aId, uN);
    float beat = pow(abs(sin(t * 1.3)), 14.0);
    float n = noise(d.xy * 3.0 + t * 0.2);
    s = 0.85;
    a = 0.6 + 0.4 * n;
    return rotY(t * 0.12) * d * (0.86 + 0.06 * n + beat * 0.05);
  }

  s = 0.7;
  a = 0.5;
  return (sd.xyz - 0.5) * vec3(5.0, 3.0, 4.0);
}

void loadDot(vec2 uv) {
  sd = texture2D(tSeed, uv);
  ex = texture2D(tExtra, uv);
  pt = texture2D(tPortrait, uv);
  aId = floor(gl_FragCoord.y) * resolution.x + floor(gl_FragCoord.x);
}

/* Each dot leaves for the new scene a little after the last. */
bool headingToB() {
  return (uTime - uSwitch) > ex.y * 0.5;
}

vec3 target(bool toB, float t, out float s, out float a) {
  vec3 st = toB ? uStageB : uStageA;
  gRadius = st.z;
  vec3 p = form(toB ? uKindB : uKindA, t, s, a);
  a *= toB ? uAlphaB : uAlphaA;
  mat3 turn = rotY(uRot.x) * rotX(uRot.y);
  return vec3(st.xy, 0.0) + turn * p * st.z;
}
`;

export const VELOCITY = /* glsl */ `
uniform float uDt;
uniform float uSnap;
uniform vec3 uPointer;     // xy world, z strength
uniform vec2 uPointerVel;  // world units per second
uniform vec4 uShock;       // xy world, start time, strength
${FORMS}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  loadDot(uv);
  vec4 P = texture2D(tPos, uv);
  vec4 V = texture2D(tVel, uv);

  float s, a;
  vec3 T = target(headingToB(), uTime, s, a);
  vec3 d = T - P.xyz;

  // A spring, a little loose, so dots overshoot and settle.
  float k = mix(48.0, 96.0, ex.w);
  float c = mix(8.0, 11.5, ex.w);
  vec3 acc = d * k - V.xyz * c;

  // While far from home, dots swirl on the way.
  float R = max(gRadius, 0.4);
  float far = clamp(length(d) / R, 0.0, 1.5);
  vec3 q = P.xyz * 1.4 / R + uTime * 0.35;
  acc += vec3(sin(q.y * 2.1 + q.z), sin(q.z * 1.7 + q.x * 1.3), sin(q.x * 1.9 + q.y)) * far * 10.0 * R;

  // The pointer pushes dots aside and drags them with it.
  vec2 pd = P.xy - uPointer.xy;
  float pl = length(pd);
  float fall = (1.0 - smoothstep(0.0, 0.8, pl)) * uPointer.z;
  acc.xy += pd / max(pl, 1e-3) * fall * 26.0 + uPointerVel * fall * 7.0;
  acc.z += fall * 10.0;

  // A click sends a ring out.
  float age = uTime - uShock.z;
  if (age > 0.0 && age < 1.4) {
    vec2 e = P.xy - uShock.xy;
    float de = length(e);
    float ring = exp(-pow((de - age * 3.2) / 0.3, 2.0)) * (1.0 - age / 1.4) * uShock.w;
    acc.xy += e / max(de, 1e-3) * ring * 90.0;
    acc.z += ring * 40.0;
  }

  vec3 v = V.xyz + acc * uDt;
  float size = mix(V.w, s, 1.0 - exp(-uDt * 9.0));
  if (uSnap > 0.5) {
    v = vec3(0.0);
    size = s;
  }
  gl_FragColor = vec4(v, size);
}
`;

export const POSITION = /* glsl */ `
uniform float uDt;
uniform float uSnap;
uniform vec3 uShiftA;      // how far each stage moved on screen this frame
uniform vec3 uShiftB;
${FORMS}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  loadDot(uv);
  vec4 P = texture2D(tPos, uv);
  vec4 V = texture2D(tVel, uv);

  bool toB = headingToB();
  float s, a, s0, a0;
  vec3 T = target(toB, uTime, s, a);
  vec3 T0 = target(toB, uTime - 0.03, s0, a0);

  // Dots ride along with their stage as the page scrolls.
  vec3 p = P.xyz + V.xyz * uDt + (toB ? uShiftB : uShiftA);
  float alpha = mix(P.w, a, 1.0 - exp(-uDt * 7.0));

  // Shapes that flow (the wormhole, the terrain) wrap around: jump, unseen, to the start.
  if (uSnap > 0.5) {
    p = T;
    alpha = a;
  } else if (length(T - T0) > 0.3 * gRadius) {
    p = T;
    alpha = 0.0;
  }
  gl_FragColor = vec4(p, alpha);
}
`;

export const VERT = /* glsl */ `
uniform sampler2D tPos;
uniform sampler2D tVel;
uniform sampler2D tSeed;
uniform sampler2D tExtra;
uniform float uTime;
uniform vec2 uView;
uniform float uCamZ;
uniform float uScroll;
uniform float uDpr;
uniform float uDust;

attribute vec2 aRef;

varying float vAlpha;
varying float vSize;

void main() {
  vec4 P = texture2D(tPos, aRef);
  vec4 V = texture2D(tVel, aRef);
  vec4 sd = texture2D(tSeed, aRef);
  vec4 ex = texture2D(tExtra, aRef);
  vec3 w = P.xyz;
  float alpha = P.w;
  float size = V.w;

  // A few dots ignore the scenes and drift past, deeper and nearer than the shapes.
  if (ex.x < uDust) {
    float z = mix(-5.0, 2.5, sd.z);
    float persp = (uCamZ - z) / uCamZ;
    float drift = uTime * 0.004 + uScroll * 0.00018 * (0.35 + sd.z);
    w = vec3(
      (sd.x - 0.5) * uView.x * 1.15 * persp + sin(uTime * 0.2 + sd.w * 6.283) * 0.08,
      (0.5 - fract(sd.y - drift)) * uView.y * 1.15 * persp,
      z
    );
    size = 0.6;
    alpha = 0.3;
  }

  vec4 mv = viewMatrix * vec4(w, 1.0);
  float depth = -mv.z;
  // Depth: far dots fade, so the shapes read as solid.
  alpha *= mix(0.3, 1.0, smoothstep(uCamZ + 5.0, uCamZ - 1.0, depth));
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(size * uDpr * (uCamZ / max(0.5, depth)), 0.0);
  vSize = gl_PointSize;
  vAlpha = alpha * smoothstep(0.0, 1.0, gl_PointSize);
}
`;

export const FRAG = /* glsl */ `
varying float vAlpha;
varying float vSize;

void main() {
  // A crisp, antialiased disc at any size.
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float edge = min(1.0, 2.0 / max(vSize, 1.0));
  float a = (1.0 - smoothstep(1.0 - edge, 1.0, d)) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vec3(a), a);
}
`;
