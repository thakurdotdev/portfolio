"use client";

import { useEffect, useRef, type RefObject } from "react";

/*
 * A field of dots drawn in one fragment shader.
 *
 * With `image`, the dots inside `anchor` are sized by the photo's tones, so the
 * picture appears as a halftone that the rest of the field flows around. Without
 * it, the field is just the drifting wave. The pointer swells the dots near it.
 *
 * Colours come from CSS on the canvas, so themes need no JS:
 *   --dot-ink     field dots
 *   --dot-accent  image dots and the pointer
 *   --dot-alpha   opacity of the field dots (0..1)
 *   --dot-invert  1 when light tones should make big dots (dark backgrounds)
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uCell;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform float uIntro;
uniform vec4 uRect;
uniform float uHasTex;
uniform float uInvert;
uniform float uFieldAlpha;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform sampler2D uTex;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  // Top-left origin, to match the DOM.
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 cell = floor(frag / uCell);
  vec2 center = (cell + 0.5) * uCell;
  float dist = length(frag - center) / uCell;

  // The field: slow bands travelling through the grid, broken up by noise.
  vec2 q = center / uRes.y;
  float band = sin(q.x * 2.6 - q.y * 1.3 - uTime * 0.42 + sin(q.y * 2.1 + uTime * 0.17) * 1.7);
  float n = noise(q * 2.4 + vec2(uTime * 0.06, -uTime * 0.04));
  float wave = smoothstep(-0.2, 1.0, band) * (0.35 + 0.65 * n);
  float r = 0.07 + 0.15 * wave;
  float lit = 0.0;

  // The image, as a halftone.
  if (uHasTex > 0.5) {
    vec2 uv = (center - uRect.xy) / uRect.zw;
    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
      vec4 px = texture2D(uTex, uv);
      float lum = dot(px.rgb, vec3(0.299, 0.587, 0.114));
      float tone = mix(1.0 - lum, lum, uInvert);
      tone = smoothstep(0.16, 0.86, tone);
      // The cutout's alpha is the silhouette. It dissolves into the field at the bottom.
      float mask = px.a * (1.0 - smoothstep(0.7, 0.96, uv.y));
      // On dark backgrounds hair and clothes keep a mid-size dot, so the figure stays whole
      // instead of becoming a floating face.
      float pr = mix(0.03, 0.17, uInvert) + mix(0.41, 0.3, uInvert) * pow(tone, 0.62);
      // A faint shimmer keeps the portrait alive without distorting it.
      pr *= 0.96 + 0.04 * sin(uTime * 1.3 + hash(cell) * 6.2831);
      r = mix(r, pr, mask);
      lit = mask;
    }
  }

  // The pointer: nearby dots swell and take the accent colour.
  vec2 dm = (center - uMouse) / uRes.y;
  float near = uMouseOn * exp(-dot(dm, dm) * 260.0);
  r = min(r + near * 0.22, 0.5);

  // Intro: a front sweeps left to right and switches the field on. The portrait develops
  // on its own clock, dot by dot in random order, like a print coming up in the tray.
  float front = uIntro * 1.4 - center.x / uRes.x - hash(cell) * 0.12;
  float sweep = smoothstep(0.0, 0.22, front);
  float develop = smoothstep(0.0, 0.18, uIntro * 1.25 - 0.1 - hash(cell + 7.0) * 0.85);
  r *= mix(sweep, develop, lit);

  float aa = 1.0 / uCell;
  float a = 1.0 - smoothstep(r - aa, r + aa, dist);
  float accent = max(lit, near);
  vec3 col = mix(uInk, uAccent, accent);
  float alpha = a * mix(uFieldAlpha, 1.0, accent);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function hexToRgb(value: string, fallback: [number, number, number]): [number, number, number] {
  const m = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

interface DotFieldProps {
  className?: string;
  /** Photo to render as a halftone. */
  image?: string;
  /** Element whose box the halftone fills. Must share the canvas's offset parent. */
  anchor?: RefObject<HTMLElement | null>;
  /** Grid pitch in CSS pixels when there is no image to derive it from. */
  cell?: number;
  /** Wait for the page intro, then sweep the dots on. */
  intro?: boolean;
}

export function DotField({ className = "", image, anchor, cell = 10, intro = false }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) {
      host?.setAttribute("data-webgl", "off");
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      host?.setAttribute("data-webgl", "off");
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uCell = u("uCell");
    const uMouse = u("uMouse");
    const uMouseOn = u("uMouseOn");
    const uIntro = u("uIntro");
    const uRect = u("uRect");
    const uHasTex = u("uHasTex");
    const uInvert = u("uInvert");
    const uFieldAlpha = u("uFieldAlpha");
    const uInk = u("uInk");
    const uAccent = u("uAccent");

    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = 1;
    let hasTex = false;
    let visible = true;
    let raf = 0;
    let disposed = false;

    // --- Photo ---------------------------------------------------------------
    if (image) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        hasTex = true;
        gl.uniform1f(uHasTex, 1);
        kick();
      };
      img.src = image;
    }
    gl.uniform1f(uHasTex, 0);

    // --- Colours -------------------------------------------------------------
    const readColours = () => {
      const cs = getComputedStyle(canvas);
      gl.uniform3fv(uInk, hexToRgb(cs.getPropertyValue("--dot-ink"), [0.05, 0.06, 0.14]));
      gl.uniform3fv(uAccent, hexToRgb(cs.getPropertyValue("--dot-accent"), [0.14, 0.22, 1]));
      gl.uniform1f(uFieldAlpha, parseFloat(cs.getPropertyValue("--dot-alpha")) || 0.2);
      gl.uniform1f(uInvert, parseFloat(cs.getPropertyValue("--dot-invert")) || 0);
    };
    readColours();
    const themeWatch = new MutationObserver(() => {
      readColours();
      kick();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // --- Size ----------------------------------------------------------------
    const measure = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);

      let pitch = cell;
      const el = anchor?.current;
      if (el) {
        const a = el.getBoundingClientRect();
        const c = canvas.getBoundingClientRect();
        // About 88 dots across the picture, whatever its size.
        pitch = Math.min(Math.max(a.width / 88, 3.6), 7.5);
        gl.uniform4f(uRect, (a.left - c.left) * dpr, (a.top - c.top) * dpr, a.width * dpr, a.height * dpr);
      } else {
        gl.uniform4f(uRect, 0, 0, 1, 1);
      }
      gl.uniform1f(uCell, pitch * dpr);
      kick();
    };
    const sizeWatch = new ResizeObserver(measure);
    sizeWatch.observe(canvas);
    if (anchor?.current) sizeWatch.observe(anchor.current);

    // --- Pointer -------------------------------------------------------------
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: 0, target: 0 };
    let idle = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const c = canvas.getBoundingClientRect();
      const inside = e.clientY >= c.top && e.clientY <= c.bottom && e.clientX >= c.left && e.clientX <= c.right;
      mouse.target = inside ? 1 : 0;
      if (!inside) return;
      mouse.tx = (e.clientX - c.left) * dpr;
      mouse.ty = (e.clientY - c.top) * dpr;
      if (mouse.on < 0.01) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(() => (mouse.target = 0), 1800);
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    // --- Loop ----------------------------------------------------------------
    const skipIntro = !intro || reduce || document.documentElement.dataset.intro === "skip";
    // The intro's timing is counted from navigation, like the CSS that runs it.
    const introStart = intro && !skipIntro ? Math.max(performance.now(), 1800) : performance.now();
    const introLength = skipIntro ? (intro && !reduce ? 1300 : 0) : 2100;
    const t0 = performance.now();

    const draw = (now: number) => {
      const p = introLength === 0 ? 1 : Math.min(Math.max((now - introStart) / introLength, 0), 1);
      mouse.x += (mouse.tx - mouse.x) * 0.14;
      mouse.y += (mouse.ty - mouse.y) * 0.14;
      mouse.on += (mouse.target - mouse.on) * 0.08;
      gl.uniform1f(uTime, reduce ? 12 : (now - t0) / 1000);
      gl.uniform1f(uIntro, 1 - Math.pow(1 - p, 3));
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.uniform1f(uHasTex, hasTex ? 1 : 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed) return;
      // Nothing is lit until the intro hands over, so skip the work behind the curtain.
      if (now >= introStart) draw(now);
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    // Draw at least one frame; keep going only while on screen.
    function kick() {
      if (!raf && !disposed) raf = requestAnimationFrame(frame);
    }

    const viewWatch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    viewWatch.observe(canvas);
    const onVisibility = () => {
      if (!document.hidden) kick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    measure();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      themeWatch.disconnect();
      sizeWatch.disconnect();
      viewWatch.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [image, anchor, cell, intro]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
