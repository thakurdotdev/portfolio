/*
 * The dots are simulated on the GPU. Two textures hold every dot's position (xyz, opacity)
 * and velocity (xyz, size). Each frame, every dot is pulled by a spring towards its place
 * in the current scene's shape, swirls while it is far from it, and is pushed and stirred
 * by the pointer. So a shape forms on its own time once a scene starts, and nothing pops
 * when scenes change halfway through a move.
 *
 * Each scene's shape is a function from a dot's random seed (and the time) to a point in a
 * unit-sized space. Kinds (keep in sync with KINDS in engine.ts):
 *   0 scatter    1 portrait   2 tunnel     3 supervisor   4 room   5 pipeline
 *   6 workflow   7 clock      9 outbox    10 encrypt  11 screen   12 chat
 *  13 boot (the typed command)
 */

const FORMS = /* glsl */ `
uniform float uTime;
uniform float uN;
uniform float uSec;     // seconds into the current minute, in India
uniform float uClockW;  // width of the clock, unit space
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
uniform float uRoomStart; // when the SyncVibe room last came on, so its story starts at the top
uniform sampler2D tSeed;
uniform sampler2D tExtra;
uniform sampler2D tPortrait;
uniform sampler2D tClock;
uniform sampler2D tText;
uniform float uTyped;   // characters of the boot command typed so far
uniform float uChars;   // characters in it
uniform vec2 uCursor;   // where the cursor is, unit space

const float TAU = 6.28318530718;

vec4 sd;          // random seeds
vec4 ex;          // x: dust test, y: delay, z: spare, w: stiffness
vec4 pt;          // portrait: xyz, tone (-1 when unused)
vec4 ck;          // clock: xyz, w: 0.13 unlit, 1 lit, 2 lit colon
vec4 tx;          // boot text: xyz, w: character index, -1 for the cursor
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

/* A point on the outline of a w×h rectangle centred on c, u in 0..1 around it. */
vec2 rectEdge(float u, vec2 c, vec2 size) {
  float d = u * 2.0 * (size.x + size.y);
  vec2 o = c - size * 0.5;
  if (d < size.x) return o + vec2(d, 0.0);
  d -= size.x;
  if (d < size.y) return o + vec2(size.x, d);
  d -= size.y;
  if (d < size.x) return o + vec2(size.x - d, size.y);
  d -= size.x;
  return o + vec2(0.0, size.y - d);
}

vec3 bez(vec3 a, vec3 b, vec3 c, float t) {
  return mix(mix(a, b, t), mix(b, c, t), t);
}

/* A point on one of the twelve edges of a unit cube centred on the origin. */
vec3 cubeEdge(float u, float pick) {
  float e = floor(pick * 12.0);
  float ax = floor(e / 4.0);
  float kk = mod(e, 4.0);
  vec2 c = vec2(mod(kk, 2.0), floor(kk / 2.0)) - 0.5;
  return ax < 0.5 ? vec3(u - 0.5, c) : ax < 1.5 ? vec3(c.x, u - 0.5, c.y) : vec3(c, u - 0.5);
}

/* SyncVibe's room: a ring on a plane tipped back, centred above the listeners. */
const vec3 SV_C = vec3(0.0, 0.34, 0.0);
const float SV_R = 0.27;
vec3 svRing(vec2 q, float lift) {
  // rotX(-0.85) of (q, lift), written out
  return SV_C + vec3(q.x, 0.66 * q.y + 0.7513 * lift, -0.7513 * q.y + 0.66 * lift);
}

/* The listeners: 0 a laptop on the left, 1 a phone on the right, 2 a phone below, each
   the same distance from the ring so the beats travel alike. c is the screen's centre, size
   its width and height; the phone below sits forward, level with the ring's near edge. */
const float SV_LINK = 0.34;
void svDevice(float g, out vec2 c, out vec2 size) {
  float x = SV_R + 0.05 + SV_LINK + 0.05;
  c = g < 0.5 ? vec2(-x - 0.19, SV_C.y) : g < 1.5 ? vec2(x + 0.1, SV_C.y)
    : vec2(0.0, SV_C.y - 0.66 * (SV_R + 0.05) - SV_LINK - 0.04 - 0.18);
  size = g < 0.5 ? vec2(0.38, 0.24) : vec2(0.2, 0.36);
}
float svDepth(float g) {
  return g > 1.5 ? 0.7513 * (SV_R + 0.05) : 0.0;
}

/* The link from the ring to device g, straight and SV_LINK long: start, midpoint, end. */
void svLink(float g, out vec3 a, out vec3 b, out vec3 e) {
  vec3 dir = g < 0.5 ? vec3(-1.0, 0.0, 0.0) : g < 1.5 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, -1.0, 0.0);
  a = g < 1.5 ? SV_C + dir * (SV_R + 0.05) : svRing(vec2(0.0, -(SV_R + 0.05)), 0.0);
  e = a + dir * SV_LINK;
  b = (a + e) * 0.5;
}

/* Seconds of the song played by time T of the ten-second story (paused 5.7 to 8.3). */
float svPlayed(float T) {
  return T < 5.7 ? T : T < 8.3 ? 5.7 : T - 2.6;
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
    s = (0.22 + 0.95 * sqrt(pt.w)) * cellPx / uSize;
    vec3 p = pt.xyz;
    p.z += sin(t * 1.1 + p.y * 3.0 + p.x * 2.0) * 0.012;
    return p;
  }

  if (k == 2) {
    // Tunl: a laptop's localhost, the internet, and one tunnel between them. Requests come
    // in from all over the globe, squeeze through the tunnel and land on the laptop;
    // responses go back the same way.
    vec3 lap = vec3(-0.62, -0.22, 0.0);
    vec3 globe = vec3(0.54, 0.14, 0.0);
    float gr = 0.3;
    vec3 mouthL = lap + vec3(0.22, 0.3, -0.05);
    vec3 mouthG = globe - vec3(gr * 0.97, 0.0, 0.0);
    vec3 ctrl = vec3(0.0, 0.66, 0.12);
    float spin = t * 0.25;
    vec3 p;
    if (sd.z < 0.2) {
      if (sd.w < 0.16) {
        // localhost output on the screen
        float row = floor(sd.y * 4.0);
        float len = 0.1 + 0.24 * hash(vec2(row, 5.1));
        p = lap + rotX(-0.18) * vec3(-0.19 + fract(sd.y * 4.0) * len, 0.27 - row * 0.065, 0.0);
        s = 0.6;
        a = 0.6;
      } else if (sd.w < 0.6) {
        // the screen, tilted back
        p = lap + rotX(-0.18) * vec3(rectEdge(sd.x, vec2(0.0, 0.17), vec2(0.5, 0.32)), 0.0);
        s = 0.8;
        a = 0.95;
      } else {
        // the keyboard deck
        vec2 e = rectEdge(sd.x, vec2(0.0, 0.0), vec2(0.56, 0.3));
        p = lap + vec3(e.x, 0.0, e.y + 0.15);
        s = 0.7;
        a = 0.75;
      }
    } else if (sd.z < 0.42) {
      // the globe: meridians and parallels, turning
      vec3 q;
      float an = sd.w * TAU;
      if (sd.x < 0.55) {
        float m = floor(sd.y * 6.0) / 6.0 * 3.14159;
        q = vec3(cos(an) * cos(m), sin(an), cos(an) * sin(m));
      } else {
        float lat = (floor(sd.y * 5.0) + 1.0) / 6.0 * 3.14159 - 1.5708;
        q = vec3(cos(lat) * cos(an), sin(lat), cos(lat) * sin(an));
      }
      p = globe + rotY(spin) * q * gr;
      s = 0.6;
      a = 0.5;
    } else if (sd.z < 0.52) {
      // the tunnel's wall: rings along the arc
      vec3 c = bez(mouthG, ctrl, mouthL, sd.x);
      vec3 tg = normalize(bez(mouthG, ctrl, mouthL, sd.x + 0.01) - c);
      vec3 n1 = normalize(cross(tg, vec3(0.0, 0.0, 1.0)));
      vec3 n2 = cross(tg, n1);
      float an = sd.y * TAU;
      p = c + (n1 * cos(an) + n2 * sin(an)) * 0.05;
      s = 0.5;
      a = 0.35;
    } else {
      bool resp = sd.w < 0.25;
      float pr = fract(sd.y + t * (resp ? 0.22 : 0.16));
      vec3 j = (vec3(sd.x, fract(sd.x * 7.3), fract(sd.x * 3.1)) - 0.5) * 0.03;
      if (resp) {
        p = bez(mouthL, ctrl, mouthG, pr) + j;
        s = 0.8;
        a = smoothstep(0.0, 0.1, pr) * (1.0 - smoothstep(0.9, 1.0, pr)) * 0.7;
      } else if (pr < 0.35) {
        vec3 src = globe + rotY(spin) * sphereDir(sd.x, fract(sd.x * 13.1)) * gr;
        p = mix(src, mouthG, smoothstep(0.0, 0.35, pr));
        s = 0.9;
        a = smoothstep(0.0, 0.08, pr);
      } else if (pr < 0.88) {
        p = bez(mouthG, ctrl, mouthL, (pr - 0.35) / 0.53) + j;
        s = 1.15;
        a = 1.0;
      } else {
        p = mix(mouthL, lap + vec3(0.0, 0.17, 0.0), (pr - 0.88) / 0.12) + j * 2.0;
        s = 0.9;
        a = 1.0 - smoothstep(0.92, 1.0, pr);
      }
    }
    return rotY(-0.25) * rotX(0.08) * p * 0.92;
  }

  if (k == 3) {
    // pm0: requests arrive on one port and are shared across four workers. pm0, the small
    // solid cube, keeps a heartbeat on each and reloads them one at a time: the old worker
    // breaks up, a fresh one flies in from pm0, and traffic routes around it meanwhile.
    vec3 port = vec3(-0.72, 0.0, 0.0);
    vec3 daemon = vec3(0.78, 0.0, 0.0);
    float cyc = t / 2.2;
    float reloading = mod(floor(cyc), 4.0);
    float f = fract(cyc);
    vec3 p;
    if (sd.z < 0.12) {
      float an = sd.y * TAU;
      p = port + vec3(0.0, cos(an), sin(an)) * 0.17;
      s = 0.7;
      a = 0.85;
    } else if (sd.z < 0.21) {
      float beat = pow(abs(sin(t * 2.6)), 12.0);
      p = daemon + (vec3(sd.x, sd.y, sd.w) - 0.5) * 0.13 * (1.0 + beat * 0.18);
      s = 0.85;
      a = 1.0;
    } else if (sd.z < 0.3) {
      float w = floor(sd.x * 4.0);
      vec3 slot = vec3(0.3, 0.54 - w * 0.36, 0.0);
      float u = sd.y;
      p = mix(daemon, slot + vec3(0.11, 0.0, 0.0), u);
      float pulse = exp(-pow((u - (1.0 - fract(t * 0.9 + w * 0.25))) * 10.0, 2.0));
      s = 0.45 + pulse;
      a = 0.14 + pulse * 0.75;
    } else if (sd.z < 0.6) {
      float w = floor(sd.x * 4.0);
      vec3 slot = vec3(0.3, 0.54 - w * 0.36, 0.0);
      vec3 q = cubeEdge(sd.y, sd.w) * 0.2;
      bool isR = abs(w - reloading) < 0.5;
      s = 0.75;
      if (isR && f < 0.3) {
        float g = smoothstep(0.0, 0.3, f);
        p = slot + q * (1.0 + g * 2.5) + vec3(g * 0.2, 0.0, 0.0);
        a = 1.0 - g;
      } else if (isR && f < 0.62) {
        float g = smoothstep(0.3, 0.62, f);
        p = mix(daemon, slot, g) + q * g;
        a = g;
      } else {
        p = slot + q;
        a = 0.95;
      }
    } else {
      float pr = fract(sd.y + t * 0.3);
      float w = floor(sd.x * 4.0);
      if (abs(w - reloading) < 0.5 && f < 0.62) w = mod(w + 1.0, 4.0);
      vec3 slot = vec3(0.3, 0.54 - w * 0.36, 0.0);
      vec3 j = vec3(sd.w, fract(sd.w * 7.7), fract(sd.w * 3.3)) - 0.5;
      if (pr < 0.4) {
        float g = pr / 0.4;
        p = mix(vec3(-1.15, 0.0, 0.0), port, g) + vec3(0.0, j.y, j.z) * (1.0 - g) * 0.35;
      } else {
        float g = (pr - 0.4) / 0.6;
        p = bez(port, vec3(-0.15, slot.y * 0.7, 0.0), slot - vec3(0.12, 0.0, 0.0), g) + j * 0.02;
      }
      s = 0.9;
      a = smoothstep(0.0, 0.1, pr) * (1.0 - smoothstep(0.92, 1.0, pr));
    }
    return rotY(-0.55) * rotX(0.28) * p * 0.92;
  }

  if (k == 4) {
    // SyncVibe: a listening room. The room is a ring whose edge is the song's waveform, with
    // a dot going round it as the song plays. Every 1.5 s of song a sync leaves the ring with
    // a ripple, glides down three equal links and lands on all three devices on the same
    // frame: their equalizers kick together.
    // A heart sent from the laptop shows on every screen. The phone on the right taps pause:
    // the signal goes into the room and back out, everyone stops on the same frame and the
    // ring falls still. Then the phone below presses play.
    float lt = max(t - uRoomStart, 0.0);
    float L = floor(lt / 10.0);
    float T = lt - L * 10.0;
    float played = L * 7.4 + svPlayed(T);
    float live = 1.0 - smoothstep(5.7, 5.85, T) + smoothstep(8.3, 8.45, T);
    float beat = fract(played / 1.5);
    float pop = exp(-beat * 6.0) * live;
    // The sync glides from the ring into each device over 80% of the cycle, eased, and
    // crosses the device's edge (SV_LINK of SV_LINK + 0.12 along its path) at 53% of it.
    float land = beat >= 0.532 ? exp(-(beat - 0.532) * 9.0) * live : 0.0;
    float prog = fract(played / 48.0);
    // Pause from the phone on the right at 5.0, play from the phone below at 7.6.
    bool second = T >= 6.65;
    float at = second ? 7.6 : 5.0;
    float from = second ? 2.0 : 1.0;
    float eu = (T - at) / 0.7;
    bool sending = eu >= 0.0 && eu < 1.0;
    float flash = exp(-pow((T - 5.35) / 0.09, 2.0)) + exp(-pow((T - 7.95) / 0.09, 2.0));
    vec3 p;

    if (sd.z < 0.27) {
      // the ring: three thin layers, the waveform running round them
      float layer = floor(sd.x * 3.0);
      float th = sd.y * TAU;
      float w = sin(14.0 * th + played * 2.6) * 0.45 + sin(23.0 * th - played * 3.4 + layer) * 0.3
        + sin(6.0 * th + played * 1.2) * 0.25;
      float kk = layer < 0.5 ? 1.0 : layer < 1.5 ? 0.6 : 0.45;
      float amp = (0.016 + 0.03 * pop) * live * kk;
      float r = (SV_R + (layer < 0.5 ? 0.0 : layer < 1.5 ? -0.035 : 0.035) + w * amp) * (1.0 - 0.05 * flash);
      r += (sd.w - 0.5) * 0.004;
      p = svRing(vec2(cos(th), sin(th)) * r, w * amp * 0.3);
      s = (layer < 0.5 ? 0.8 : 0.6) + pop * 0.15;
      a = (layer < 0.5 ? 0.9 : layer < 1.5 ? 0.45 : 0.3) * (0.75 + 0.25 * abs(w)) + flash * 0.5;
    } else if (sd.z < 0.32) {
      // each beat leaves the ring as a ripple, far enough that its dots wrap back unseen
      float th = sd.y * TAU;
      p = svRing(vec2(cos(th), sin(th)) * (SV_R + 0.04 + beat * 0.42), 0.0);
      s = 0.6;
      a = pow(1.0 - beat, 2.0) * smoothstep(0.0, 0.04, beat) * 0.5 * live;
    } else if (sd.z < 0.34) {
      // the song's progress, going round the ring
      float th = 1.5708 - prog * TAU;
      p = svRing(vec2(cos(th), sin(th)) * SV_R, 0.012) + sphereDir(sd.x, sd.w) * 0.018 * sqrt(sd.y);
      s = 1.05;
      a = 1.0;
    } else if (sd.z < 0.66) {
      // the devices
      float g = min(floor((sd.z - 0.34) / 0.32 * 3.0), 2.0);
      bool lap = g < 0.5;
      vec2 c, size;
      svDevice(g, c, size);
      float eqBase = c.y + (lap ? -0.065 : -0.03);
      float eqMax = lap ? 0.085 : 0.12;
      float progY = c.y + (lap ? -0.09 : -0.1);
      float hw = lap ? 0.13 : 0.07;
      if (sd.w < 0.34) {
        // the outline; the one that taps lights up
        float glow = sending && abs(from - g) < 0.5 ? max(0.0, 1.0 - (T - at) / 0.5) : land * 0.35;
        if (lap && sd.y > 0.68) {
          vec2 e = rectEdge(sd.x, vec2(0.0), vec2(0.46, 0.24));
          p = vec3(c.x + e.x, c.y - size.y * 0.5 - 0.02, e.y + 0.14);
          a = 0.6;
        } else {
          p = vec3(rectEdge(sd.x, c, size), 0.0);
          a = 0.7;
        }
        s = 0.6 + glow * 0.4;
        a = min(1.0, a + glow * 0.4);
      } else if (sd.w < 0.62) {
        // the equalizer: the same five bars on every device, kicking as each sync lands
        float bar = floor(sd.x * 5.0);
        float b = 0.3 + 0.7 * abs(sin(played * 3.1 + bar * 1.7)) * (0.6 + 0.4 * sin(played * 1.3 + bar));
        float h = eqMax * mix(0.06, clamp(0.15 + 0.5 * b + 0.45 * land * (1.0 - bar * 0.12), 0.06, 1.0), live);
        p = vec3(c.x + (bar - 2.0) * (lap ? 0.036 : 0.031) + (fract(sd.x * 5.0) - 0.5) * 0.014, eqBase + sd.y * h, 0.0);
        s = 0.7;
        a = 0.9;
      } else if (sd.w < 0.7) {
        // the progress bar
        p = vec3(c.x - hw + sd.x * hw * 2.0, progY, 0.0);
        s = 0.5;
        a = sd.x < prog ? 0.85 : 0.22;
      } else if (sd.w < 0.74) {
        p = vec3(c.x - hw + prog * hw * 2.0, progY, 0.0) + sphereDir(sd.x, sd.y) * 0.012 * sqrt(fract(sd.x * 7.3));
        s = 0.95;
        a = 1.0;
      } else if (sd.w < 0.84) {
        // the pause sign, while paused
        float side = sd.x < 0.5 ? -1.0 : 1.0;
        vec2 gc = vec2(c.x, c.y + (lap ? 0.04 : 0.055));
        p = vec3(gc.x + side * 0.024 + (fract(sd.x * 2.0) - 0.5) * 0.014, gc.y + (sd.y - 0.5) * 0.085, 0.01);
        s = 0.75;
        a = 1.0 - live;
      } else {
        // a heart: from the laptop first, then on the others
        float u = (T - (lap ? 2.0 : 2.35)) / 1.3;
        float th = sd.x * TAU;
        float sn = sin(th);
        vec2 hp = vec2(16.0 * sn * sn * sn, 13.0 * cos(th) - 5.0 * cos(2.0 * th) - 2.0 * cos(3.0 * th) - cos(4.0 * th));
        p = vec3(c.x + hp.x * 0.0023, c.y + (lap ? 0.055 : 0.07) + hp.y * 0.0023 + clamp(u, 0.0, 1.0) * (lap ? 0.03 : 0.09), 0.02);
        s = 0.7;
        a = u >= 0.0 && u <= 1.0 ? smoothstep(0.0, 0.1, u) * (1.0 - u) : 0.0;
      }
      p.z += svDepth(g);
    } else if (sd.z < 0.72) {
      // the links, faint
      vec3 la, lb, le;
      svLink(min(floor(sd.x * 3.0), 2.0), la, lb, le);
      p = bez(la, lb, le, sd.y);
      s = 0.45;
      a = 0.16;
    } else if (sd.z < 0.85) {
      // the sync on its way: the same small packet on every link, eased, entering the
      // device and fading as it lands; then it waits there, unseen, and jumps back
      vec3 la, lb, le;
      vec3 dir;
      float g = min(floor(sd.x * 3.0), 2.0);
      svLink(g, la, lb, le);
      dir = normalize(le - la);
      float lag = sd.y * 0.025;
      float u = smoothstep(0.0, 0.8, beat - lag);
      float k = SV_LINK / (SV_LINK + 0.12);
      vec3 j = (vec3(fract(sd.x * 3.0), sd.w, fract(sd.w * 7.1)) - 0.5) * 0.026;
      p = la + dir * u * (SV_LINK + 0.12) + j;
      s = 0.95 - sd.y * 0.25;
      a = smoothstep(0.0, 0.05, beat - lag) * (1.0 - smoothstep(k, 1.0, u)) * (1.0 - sd.y * 0.5)
        * live * (sending ? 0.15 : 1.0);
    } else if (sd.z < 0.95) {
      // a tap: from the device into the room, then out to everyone at once
      float g = min(floor(sd.x * 3.0), 2.0);
      vec3 fa, fb, fe, ga, gb, ge;
      svLink(from, fa, fb, fe);
      svLink(g, ga, gb, ge);
      vec3 j = (vec3(fract(sd.x * 3.0), sd.y, sd.w) - 0.5) * 0.04;
      if (!sending) {
        // wait, unseen, where the next tap starts
        svLink(T >= 8.3 || T < 5.0 ? 1.0 : 2.0, fa, fb, fe);
        p = fe;
        a = 0.0;
      } else {
        p = eu < 0.36 ? bez(fe, fb, fa, eu / 0.36)
          : eu < 0.5 ? mix(fa, SV_C, (eu - 0.36) / 0.14)
          : eu < 0.64 ? mix(SV_C, ga, (eu - 0.5) / 0.14)
          : bez(ga, gb, ge, (eu - 0.64) / 0.36);
        a = smoothstep(0.0, 0.05, eu) * (1.0 - smoothstep(0.95, 1.0, eu));
      }
      p += j;
      s = 1.2;
    } else {
      // the tap itself: a ring spreading from the device that tapped
      bool first = sd.x < 0.5;
      vec2 c, size;
      svDevice(first ? 1.0 : 2.0, c, size);
      float u = (T - (first ? 5.0 : 7.6)) / 0.6;
      float th = sd.y * TAU;
      p = vec3(c + vec2(cos(th), sin(th)) * (0.05 + 0.24 * clamp(u, 0.0, 1.0)), svDepth(first ? 1.0 : 2.0));
      s = 0.6;
      a = u >= 0.0 && u <= 1.0 ? (1.0 - u) * 0.8 : 0.0;
    }
    return rotY(0.1 * sin(t * 0.17)) * rotX(-0.16) * (p + vec3(0.1, 0.0, 0.0)) * 0.85;
  }

  if (k == 5) {
    // ShipYard: a commit is pushed, the build runs with its log scrolling live, and the
    // release ships to the running app, which refreshes.
    float f = fract(t / 4.0);
    vec3 gitC = vec3(-0.82, 0.0, 0.0);
    vec3 build = vec3(-0.08, 0.0, 0.0);
    vec2 bs = vec2(0.6, 0.78);
    vec3 app = vec3(0.72, 0.0, 0.0);
    vec2 aps = vec2(0.42, 0.56);
    vec3 p;
    if (sd.z < 0.16) {
      // git: main, a feature branch merging back, commits as rings; the newest one blinks
      if (sd.x < 0.35) {
        p = gitC + vec3(0.0, mix(-0.62, 0.56, sd.y), 0.0);
        s = 0.5;
        a = 0.5;
      } else if (sd.x < 0.55) {
        p = gitC + vec3(sin(sd.y * 3.14159) * 0.16, mix(-0.34, 0.22, sd.y), 0.0);
        s = 0.5;
        a = 0.45;
      } else {
        float node = floor(sd.y * 5.0);
        float an = sd.w * TAU;
        p = gitC + vec3(0.0, -0.56 + node * 0.28, 0.0) + vec3(cos(an), sin(an), 0.0) * 0.045;
        s = 0.75;
        a = node > 3.5 ? 0.4 + 0.6 * step(fract(t * 1.5), 0.5) : 0.85;
      }
    } else if (sd.z < 0.27) {
      // the build window and its title bar
      p = sd.w < 0.8
        ? build + vec3(rectEdge(sd.x, vec2(0.0), bs), 0.0)
        : build + vec3(mix(-0.5, 0.5, sd.x) * bs.x, bs.y * 0.5 - 0.08, 0.0);
      s = 0.6;
      a = 0.8;
    } else if (sd.z < 0.55) {
      // the build log: each dot belongs to one line, which moves up as new lines arrive
      float rows = 10.0;
      float scroll = t * 1.6;
      float F = floor(scroll);
      float g = floor(sd.x * rows);
      float m = F - mod(F - g, rows);
      float slot = F - m;
      float y = -bs.y * 0.5 + 0.06 + (slot + smoothstep(0.0, 0.4, fract(scroll))) * 0.064;
      float len = 0.1 + 0.36 * hash(vec2(m, 1.7));
      float indent = step(0.7, hash(vec2(m, 4.3))) * 0.05;
      p = build + vec3(-bs.x * 0.5 + 0.06 + indent + sd.y * len, y, 0.0);
      s = 0.6;
      a = 0.75 * (1.0 - smoothstep(bs.y * 0.5 - 0.2, bs.y * 0.5 - 0.1, y)) * smoothstep(-bs.y * 0.5 + 0.03, -bs.y * 0.5 + 0.08, y);
    } else if (sd.z < 0.72) {
      // the app: a window, a live dot, and content that redraws when a release lands
      float landed = smoothstep(0.82, 0.86, f) * (1.0 - smoothstep(0.88, 1.0, f));
      if (sd.w < 0.42) {
        p = app + vec3(rectEdge(sd.x, vec2(0.0), aps), 0.0);
        s = 0.6;
        a = 0.8;
      } else if (sd.w < 0.5) {
        p = app + vec3(-aps.x * 0.5 + 0.06, aps.y * 0.5 - 0.06, 0.0) + sphereDir(sd.x, sd.y) * 0.02;
        s = 0.9;
        a = 0.55 + 0.45 * sin(t * 4.0);
      } else {
        float b = floor(sd.x * 3.0);
        vec2 sz = b < 0.5 ? vec2(0.3, 0.08) : vec2(0.32 - b * 0.06, 0.04);
        vec2 q = vec2(-0.02, 0.1 - b * 0.15) + (vec2(sd.y, fract(sd.x * 3.0)) - 0.5) * sz;
        p = app + vec3(q, 0.0) + vec3(0.0, 0.0, landed * (sd.y - 0.5) * 0.3);
        s = 0.7;
        a = 0.65 * (1.0 - landed * 0.8);
      }
    } else {
      // in flight: the commit into the build, then the release (a container) to the app
      bool commit = sd.w < 0.5;
      vec3 j = (vec3(sd.x, sd.y, fract(sd.x * 5.1)) - 0.5) * 0.06;
      if (commit) {
        float g = smoothstep(0.0, 0.25, f);
        p = bez(gitC + vec3(0.0, 0.56, 0.0), vec3(-0.5, 0.66, 0.1), build + vec3(-bs.x * 0.5, 0.22, 0.0), g) + j;
        a = smoothstep(0.0, 0.03, f) * (1.0 - smoothstep(0.24, 0.3, f));
      } else {
        float g = smoothstep(0.55, 0.82, f);
        vec3 c = bez(build + vec3(bs.x * 0.5, -0.12, 0.0), vec3(0.34, -0.5, 0.1), app + vec3(-aps.x * 0.5, 0.0, 0.0), g);
        p = c + cubeEdge(sd.y, fract(sd.x * 3.7)) * 0.1;
        a = smoothstep(0.53, 0.56, f) * (1.0 - smoothstep(0.82, 0.86, f));
      }
      s = 0.85;
    }
    return rotY(-0.3) * rotX(0.1) * (p - vec3(0.04, 0.0, 0.0)) * 0.9;
  }

  if (k == 6) {
    // ECCB: complaints arrive by three channels and route themselves through the case
    // stages. A few are escalated and take the long way round.
    vec3 S0 = vec3(-0.45, 0.0, 0.0);
    vec3 S1 = vec3(-0.05, 0.0, 0.0);
    vec3 S2 = vec3(0.35, 0.0, 0.0);
    vec3 S3 = vec3(0.8, 0.0, 0.0);
    vec3 ESC = vec3(0.35, 0.52, 0.0);
    vec3 p;
    if (sd.z < 0.34) {
      float node = floor(sd.x * 4.0);
      vec3 c = node < 1.0 ? S0 : node < 2.0 ? S1 : node < 3.0 ? S2 : S3;
      float an = sd.y * TAU;
      p = c + vec3(cos(an), sin(an), 0.0) * (node > 2.5 ? 0.15 : 0.11);
      s = 0.7;
      a = 0.75;
    } else if (sd.z < 0.4) {
      float an = sd.y * TAU;
      p = ESC + vec3(cos(an), sin(an), 0.0) * 0.08;
      s = 0.6;
      a = 0.5;
    } else {
      float ch = floor(sd.w * 3.0);
      vec3 entry = vec3(-0.95, (ch - 1.0) * 0.42, 0.0);
      bool esc = fract(sd.w * 7.3) < 0.16;
      float pr = fract(sd.y + t * 0.07);
      float seg = floor(pr * 4.0);
      float f = smoothstep(0.2, 0.8, fract(pr * 4.0));
      vec3 from;
      vec3 to;
      if (seg < 1.0) { from = entry; to = S0; }
      else if (seg < 2.0) { from = S0; to = S1; }
      else if (seg < 3.0) { from = S1; to = esc ? ESC : S2; }
      else { from = esc ? ESC : S2; to = S3; }
      vec3 j = (vec3(sd.x, fract(sd.x * 13.7), fract(sd.y * 7.1)) - 0.5) * 0.08;
      p = mix(from, to, f) + j;
      p.y += sin(f * 3.14159) * (esc ? 0.1 : -0.04);
      s = esc ? 1.35 : 1.0;
      a = smoothstep(0.0, 0.04, pr) * (1.0 - smoothstep(0.93, 1.0, pr));
    }
    return rotX(-0.3) * rotY(0.35) * p * 1.05;
  }

  if (k == 7) {
    // Contact: the time in India on a dot-matrix display. When the minute turns, the dots
    // move from the old digits to the new ones. Below, a row of sixty fills by the second.
    vec3 p;
    if (sd.z < 0.08) {
      float idx = floor(sd.x * 60.0);
      float lit = step(idx, floor(uSec) - 0.5);
      float now = 1.0 - step(0.5, abs(idx - floor(uSec)));
      float an = sd.y * TAU;
      float rr = sqrt(sd.w) * uClockW / 60.0 * 0.32;
      p = vec3(((idx + 0.5) / 60.0 - 0.5) * uClockW + cos(an) * rr, -0.93 + sin(an) * rr, 0.0);
      s = 0.6 + now * 0.4;
      a = 0.14 + lit * 0.66 + now * 0.2;
      return p;
    }
    p = ck.xyz;
    s = ck.w > 0.5 ? 0.9 : 0.65;
    a = ck.w > 1.5 ? 0.2 + 0.8 * step(fract(uSec), 0.5) : min(ck.w, 1.0);
    p.z += sin(t * 1.4 + p.x * 1.5) * 0.015;
    return p;
  }

  if (k == 13) {
    // Boot: "$ pm0 start portfolio" typed on a dot-matrix display. A character's dots wait
    // inside the cursor, unseen, and fly out to their LEDs as it is typed.
    s = 0.95;
    if (tx.w < -0.5) {
      a = uTyped < uChars ? 1.0 : step(fract(t * 1.6), 0.5);
      return vec3(uCursor, 0.0) + tx.xyz;
    }
    bool shown = tx.w < uTyped;
    a = shown ? 1.0 : 0.0;
    return shown ? tx.xyz : vec3(uCursor, 0.0);
  }

  if (k == 9) {
    // Outbox: each tenant database writes its changes to an outbox, and workers stream
    // them into one read database that answers fast.
    float tn = floor(sd.x * 5.0);
    vec3 tc = vec3(-0.72, (tn - 2.0) * 0.36, 0.0);
    vec3 cc = vec3(0.55, 0.0, 0.0);
    vec3 p;
    if (sd.z < 0.5) {
      bool central = sd.z < 0.2;
      vec3 c = central ? cc : tc;
      float rad = central ? 0.27 : 0.12;
      float hh = central ? 0.5 : 0.18;
      float an = sd.y * TAU;
      float band = floor(sd.w * 4.0);
      float y = (1.0 - band) * hh * 0.5;
      if (band > 2.5) {
        // The sides: a few vertical lines.
        y = (fract(sd.w * 9.1) - 0.5) * hh;
        an = floor(sd.y * 12.0) / 12.0 * TAU;
      }
      p = c + vec3(cos(an) * rad, y, sin(an) * rad);
      s = central ? 0.85 : 0.7;
      a = band < 2.5 ? 0.9 : 0.35;
    } else {
      float pr = fract(sd.y + t * 0.3 + tn * 0.13);
      vec3 from = tc + vec3(0.14, 0.0, 0.0);
      vec3 to = cc + vec3(-0.28, (tn - 2.0) * 0.06, 0.0);
      vec3 mid = vec3(-0.05, (tn - 2.0) * 0.16, 0.18);
      p = mix(mix(from, mid, pr), mix(mid, to, pr), pr);
      p += (vec3(sd.w, fract(sd.w * 5.3), fract(sd.w * 11.7)) - 0.5) * 0.03;
      s = 0.9;
      a = smoothstep(0.0, 0.08, pr) * (1.0 - smoothstep(0.9, 1.0, pr));
    }
    return rotX(0.28) * rotY(-0.3 + sin(t * 0.2) * 0.1) * p;
  }

  if (k == 10) {
    // Hybrid encryption: a fresh key crosses first (RSA), then the payload crosses
    // scrambled (AES-GCM) and is put back together on the other side.
    float ph = fract(t / 5.0);
    vec3 L = vec3(-0.62, 0.0, 0.0);
    vec3 R = vec3(0.62, 0.0, 0.0);
    vec3 p;
    if (sd.z < 0.12) {
      float an = sd.y * TAU;
      p = mix(L, R, step(0.5, sd.x)) + vec3(cos(an), sin(an), 0.0) * 0.34;
      s = 0.6;
      a = 0.35;
    } else if (sd.z < 0.2) {
      float m = smoothstep(0.02, 0.24, ph);
      vec3 c = mix(L, R, m) + vec3(0.0, 0.42 + sin(m * 3.14159) * 0.25, 0.0);
      float an = sd.y * TAU;
      p = sd.x < 0.4 ? c + vec3(0.05 + sd.y * 0.11, 0.0, 0.0) : c + vec3(cos(an), sin(an), 0.0) * 0.045;
      s = 0.9;
      a = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.88, 0.97, ph));
    } else {
      float gx = mod(aId, 64.0) / 63.0 - 0.5;
      float gy = mod(floor(aId / 64.0), 40.0) / 39.0 - 0.5;
      vec3 cell = vec3(gx * 0.44, gy * 0.3, 0.0);
      float m = smoothstep(0.3, 0.75, ph);
      float scr = sin(m * 3.14159);
      vec3 noisy = (vec3(sd.x, sd.y, sd.w) - 0.5) * vec3(0.55, 0.45, 0.55);
      p = mix(L, R, m) + mix(cell, noisy, scr);
      s = 0.75 + scr * 0.25;
      a = mix(0.9, 0.6, scr) * smoothstep(0.0, 0.04, ph) * (1.0 - smoothstep(0.93, 1.0, ph));
    }
    return rotX(-0.2) * rotY(0.25) * p;
  }

  if (k == 11) {
    // KYC/AML: applications stream through a check. A few are pulled aside for review.
    vec3 tray = vec3(0.62, -0.6, 0.0);
    vec3 p;
    if (sd.z < 0.16) {
      float an = sd.y * TAU;
      p = vec3((sd.w - 0.5) * 0.04, cos(an) * 0.32, sin(an) * 0.32);
      s = 0.7;
      a = 0.85;
    } else if (sd.z < 0.24) {
      float rr = sqrt(sd.y) * 0.18;
      float an = sd.w * TAU;
      p = tray + vec3(cos(an) * rr, 0.0, sin(an) * rr);
      s = 0.6;
      a = 0.4;
    } else {
      float pr = fract(sd.y + t * 0.11);
      bool flag = fract(sd.w * 17.3) < 0.1;
      float x = mix(-1.0, 1.0, pr);
      float spread = mix(0.08, 0.6, smoothstep(0.0, 1.0, abs(x)));
      vec2 off = (vec2(sd.x, fract(sd.x * 31.7)) - 0.5) * 2.0;
      p = vec3(x, off.x * spread * 0.45, off.y * spread * 0.45);
      if (flag) p = mix(p, tray + vec3(off.x, 0.04, off.y) * 0.12, smoothstep(0.0, 0.55, x));
      s = flag ? 1.25 : 0.85;
      a = smoothstep(0.0, 0.08, pr) * (1.0 - smoothstep(0.9, 1.0, pr));
    }
    return rotY(-0.5) * rotX(0.15) * p * 0.82;
  }

  if (k == 12) {
    // The internship: a real-time chat. Messages arrive, the log moves up, someone is typing.
    float msgT = t / 1.4;
    float F = floor(msgT);
    float ease = smoothstep(0.0, 0.35, fract(msgT));
    vec3 p;
    if (sd.z < 0.1) {
      float side = mod(F + 1.0, 2.0) < 0.5 ? -1.0 : 1.0;
      float di = floor(sd.y * 3.0);
      vec3 c = vec3(side * 0.62 + (di - 1.0) * 0.08, -0.74 + abs(sin(t * 6.0 - di * 0.9)) * 0.04, 0.0);
      p = c + sphereDir(sd.x, sd.w) * 0.022;
      s = 0.9;
      a = smoothstep(0.35, 0.5, fract(msgT));
      return rotY(0.2) * p;
    }
    // Each dot belongs to one message, which moves up a slot with every new one.
    float g = floor(sd.x * 6.0);
    float m = F - mod(F - g, 6.0);
    float slot = F - m;
    float side = mod(m, 2.0) < 0.5 ? -1.0 : 1.0;
    float w = 0.36 + 0.44 * hash(vec2(m, 3.7));
    float h = 0.1 + 0.07 * step(0.6, hash(vec2(m, 9.1)));
    float y = -0.52 + (slot + ease) * 0.22;
    vec2 q;
    if (sd.w < 0.45) {
      float u = sd.y;
      float e = floor(sd.z * 4.0);
      q = e < 1.0 ? vec2(u, 0.0) : e < 2.0 ? vec2(u, 1.0) : e < 3.0 ? vec2(0.0, u) : vec2(1.0, u);
    } else {
      q = vec2(sd.y, fract(sd.w * 7.7));
    }
    float pop = slot < 0.5 ? smoothstep(0.0, 0.3, fract(msgT)) : 1.0;
    p = vec3(side * (0.82 - w * 0.5) + (q.x - 0.5) * w * pop, y + (q.y - 0.5) * h * pop, 0.0);
    s = sd.w < 0.45 ? 0.85 : 0.6;
    a = (sd.w < 0.45 ? 1.0 : 0.45) * (1.0 - smoothstep(0.42, 0.7, y));
    return rotY(0.2) * p;
  }

  s = 0.7;
  a = 0.5;
  return (sd.xyz - 0.5) * vec3(5.0, 3.0, 4.0);
}

void loadDot(vec2 uv) {
  sd = texture2D(tSeed, uv);
  ex = texture2D(tExtra, uv);
  pt = texture2D(tPortrait, uv);
  ck = texture2D(tClock, uv);
  tx = texture2D(tText, uv);
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
  bool toB = headingToB();
  vec3 T = target(toB, uTime, s, a);
  vec3 d = T - P.xyz;

  // A spring, a little loose, so dots overshoot and settle. Typed characters snap into
  // their LEDs instead, so the command stays legible while it is typed.
  bool typing = (toB ? uKindB : uKindA) == 13;
  float stiff = typing ? 2.6 : 1.0;
  float k = mix(48.0, 96.0, ex.w) * stiff;
  float c = mix(8.0, 11.5, ex.w) * sqrt(stiff) * (typing ? 1.25 : 1.0);
  vec3 acc = d * k - V.xyz * c;

  // While far from home, dots swirl on the way.
  float R = max(gRadius, 0.4);
  float far = typing ? 0.0 : clamp(length(d) / R, 0.0, 1.5);
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

  // Shapes that loop (traffic, build logs, chat) wrap around: jump, unseen, to the start.
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
uniform float uSize;

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
    size = 0.55;
    alpha = 0.22;
  }

  vec4 mv = viewMatrix * vec4(w, 1.0);
  float depth = -mv.z;
  // Depth: far dots fade, so the shapes read as solid.
  alpha *= mix(0.3, 1.0, smoothstep(uCamZ + 5.0, uCamZ - 1.0, depth));
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(size * uSize * uDpr * (uCamZ / max(0.5, depth)), 0.0);
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

/*
 * The two passes with only the boot's shape left in form(). Every scene is one big function,
 * and the GPU compiles all of it before the first frame. That took seconds on some machines,
 * with only the loading caret on screen. This cut is a fraction of the code, so the command
 * is typed at once while the full passes compile behind it.
 */
const onlyBoot = (src: string) =>
  src.replace(/\n {2}if \(k == (\d+)\) \{\n[\s\S]*?\n {2}\}\n/g, (block, k: string) => (k === "13" ? block : "\n"));
export const BOOT_VELOCITY = onlyBoot(VELOCITY);
export const BOOT_POSITION = onlyBoot(POSITION);
