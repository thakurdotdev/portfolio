"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/*
 * One screen for all projects. Switching projects breaks the current screenshot into dots,
 * swaps them cell by cell, and resolves the next one: the same dots as the rest of the page.
 * The pointer turns the screenshot back into dots around it.
 *
 * Plain <img> layers sit underneath for no-WebGL, no-JS and screen readers' sake; they hide
 * once the canvas is drawing (`[data-webgl="on"]`).
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform float uHasA;
uniform float uT;
uniform float uCell;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform vec3 uBg;
uniform vec3 uInk;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Cover-fit, anchored to the top of the screenshot.
vec2 cover(vec2 p, vec2 img) {
  float ca = uRes.x / uRes.y;
  float ia = img.x / img.y;
  if (ia > ca) return vec2((p.x - 0.5) * (ca / ia) + 0.5, p.y);
  return vec2(p.x, p.y * (ia / ca));
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 cell = floor(frag / uCell);
  vec2 center = (cell + 0.5) * uCell;
  float h = hash(cell);

  // Every cell dissolves, switches and resolves at its own moment.
  float d = clamp(sin(3.14159265 * uT) * 1.7 - h * 0.7, 0.0, 1.0);
  float lens = uMouseOn * (1.0 - smoothstep(uCell * 1.5, uCell * 7.0, length(frag - uMouse)));
  d = max(d, lens * 0.92);
  float useB = step(0.22 + 0.56 * h, uT);

  vec2 p = frag / uRes;
  vec2 pc = center / uRes;
  vec3 blank = mix(uBg, uInk, 0.08);
  vec3 a = mix(blank, texture2D(uA, cover(p, uSizeA)).rgb, uHasA);
  vec3 b = texture2D(uB, cover(p, uSizeB)).rgb;
  vec3 ac = mix(blank, texture2D(uA, cover(pc, uSizeA)).rgb, uHasA);
  vec3 bc = texture2D(uB, cover(pc, uSizeB)).rgb;
  vec3 px = mix(a, b, useB);
  vec3 cc = mix(ac, bc, useB);

  if (d < 0.002) {
    gl_FragColor = vec4(px, 1.0);
    return;
  }

  // The dot shrinks from covering the cell to a separate dot of the cell's colour.
  float r = mix(0.8, 0.4, d);
  float dist = length(frag - center) / uCell;
  float aa = 1.5 / uCell;
  float inside = 1.0 - smoothstep(r - aa, r + aa, dist);
  // The gaps open onto the page only once the dots have formed, so no seams appear early on.
  vec3 gap = mix(px, uBg, smoothstep(0.3, 0.85, d));
  gl_FragColor = vec4(mix(gap, mix(px, cc, d), inside), 1.0);
}
`;

function hexToRgb(value: string, fallback: [number, number, number]): [number, number, number] {
  const m = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function ProjectScreen({
  images,
  alts,
  active,
}: {
  images: string[];
  alts: string[];
  active: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Lets the GL effect read the latest `active` without re-running.
  const activeRef = useRef(active);
  const goRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    goRef.current(active);
  }, [active]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    // The screen only exists on wide layouts; phones get the plain images inline.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const opts = { alpha: false, antialias: false, premultipliedAlpha: false };
    const gl2 = canvas.getContext("webgl2", opts);
    const gl = (gl2 ?? canvas.getContext("webgl", opts)) as WebGLRenderingContext | null;
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const U = {
      res: u("uRes"),
      a: u("uA"),
      b: u("uB"),
      sizeA: u("uSizeA"),
      sizeB: u("uSizeB"),
      hasA: u("uHasA"),
      t: u("uT"),
      cell: u("uCell"),
      mouse: u("uMouse"),
      mouseOn: u("uMouseOn"),
      bg: u("uBg"),
      ink: u("uInk"),
    };
    gl.uniform1i(U.a, 0);
    gl.uniform1i(U.b, 1);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let dpr = 1;

    // --- Textures --------------------------------------------------------------
    const blankTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, blankTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    const texs: (WebGLTexture | null)[] = images.map(() => null);
    const sizes: [number, number][] = images.map(() => [1, 1]);
    images.forEach((src, i) => {
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        if (gl2) {
          // Mipmaps keep small text in the screenshots legible when scaled down.
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        texs[i] = tex;
        sizes[i] = [img.naturalWidth, img.naturalHeight];
        kick();
      };
      img.src = src;
    });

    // --- Colours -----------------------------------------------------------------
    const readColours = () => {
      const cs = getComputedStyle(wrap);
      gl.uniform3fv(U.bg, hexToRgb(cs.getPropertyValue("--bg"), [0.93, 0.93, 0.95]));
      gl.uniform3fv(U.ink, hexToRgb(cs.getPropertyValue("--fg"), [0.05, 0.06, 0.14]));
    };
    readColours();
    const themeWatch = new MutationObserver(() => {
      readColours();
      kick();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // --- Size --------------------------------------------------------------------
    const measure = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.res, w, h);
      gl.uniform1f(U.cell, Math.min(Math.max(canvas.clientWidth / 52, 10), 18) * dpr);
      kick();
    };
    const sizeWatch = new ResizeObserver(measure);
    sizeWatch.observe(canvas);

    // --- Transition state --------------------------------------------------------
    // `from` is what the screen shows; `to` is where it is going. -1 is the empty grid.
    let from = -1;
    let to = activeRef.current;
    let t = 0;
    let last = 0;
    let started = false;
    const DURATION = 1050;

    goRef.current = (i: number) => {
      if (i === to) return;
      if (t >= 0.5) {
        // Past the midpoint the new image already dominates; keep the dot amount continuous.
        from = to;
        t = 1 - t;
      }
      to = i;
      if (reduce) {
        from = i;
        t = 1;
      }
      kick();
    };

    // --- Pointer -------------------------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, on: 0, target: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) * dpr;
      mouse.ty = (e.clientY - r.top) * dpr;
      if (mouse.on < 0.01) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.target = 1;
      kick();
    };
    const onLeave = () => {
      mouse.target = 0;
      kick();
    };
    if (!reduce) {
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    // --- Loop ----------------------------------------------------------------------
    const bind = (unit: number, i: number) => {
      gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, i >= 0 && texs[i] ? texs[i] : blankTex);
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed) return;
      const dt = last ? Math.min(now - last, 50) : 16;
      last = now;

      // Wait for the target screenshot before moving.
      const ready = texs[to] !== null;
      if (ready && started && t < 1) t = Math.min(1, t + dt / DURATION);
      if (t >= 1 && from !== to) {
        from = to;
      }

      mouse.x += (mouse.tx - mouse.x) * 0.2;
      mouse.y += (mouse.ty - mouse.y) * 0.2;
      mouse.on += (mouse.target - mouse.on) * 0.12;

      const settled = t >= 1 && from === to;
      bind(0, settled ? to : from);
      bind(1, to);
      const sa = sizes[settled ? to : from] ?? [1, 1];
      const sb = sizes[to] ?? [1, 1];
      gl.uniform2f(U.sizeA, sa[0], sa[1]);
      gl.uniform2f(U.sizeB, sb[0], sb[1]);
      gl.uniform1f(U.hasA, (settled ? to : from) >= 0 && texs[settled ? to : from] ? 1 : 0);
      gl.uniform1f(U.t, settled ? 1 : easeInOut(t));
      gl.uniform2f(U.mouse, mouse.x, mouse.y);
      gl.uniform1f(U.mouseOn, mouse.on);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!wrap.dataset.webgl) wrap.dataset.webgl = "on";

      // Draw only while something changes. A texture arriving or the pointer kicks it again.
      const moving = (started && ready && !settled) || Math.abs(mouse.target - mouse.on) > 0.002;
      if (moving) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    function kick() {
      if (!raf && !disposed) raf = requestAnimationFrame(frame);
    }

    // The first screenshot resolves out of the empty grid when the screen scrolls into view.
    const viewWatch = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          if (reduce) {
            from = to;
            t = 1;
          }
          kick();
        }
      },
      { threshold: 0.35 },
    );
    viewWatch.observe(canvas);

    measure();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      goRef.current = () => {};
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      themeWatch.disconnect();
      sizeWatch.disconnect();
      viewWatch.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Keyed on the paths, so a new array with the same images does not rebuild the context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join("|")]);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={alts[active]}
      className="relative aspect-[7/5] w-full overflow-hidden rounded-[14px] bg-surface"
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="58vw"
          className={`screen-fallback object-cover object-top transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
