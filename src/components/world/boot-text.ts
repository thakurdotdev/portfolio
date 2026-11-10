/*
 * The boot sequence's text, as a dot-matrix display drawn by the dots: the same 5×7 LEDs
 * as the clock. Each lit LED gets a small disc of dots; a block cursor sits after the text.
 */

/* 35 bits per glyph, row by row; 40 for a glyph with a descender (an eighth row). */
const GLYPHS: Record<string, string> = {
  $: "00100011111010001110001011111000100",
  p: "0000000000111101000110001111101000010000",
  m: "00000000001101010101101011010110101",
  "0": "01110100011001110101110011000101110",
  s: "00000000000111110000011100000111110",
  t: "01000010001110001000010000100100110",
  a: "00000000000111000001011111000101111",
  r: "00000000001011011001100001000010000",
  o: "00000000000111010001100011000101110",
  f: "00110010010100011100010000100001000",
  l: "01100001000010000100001000010001110",
  i: "00100000000110000100001000010001110",
  " ": "00000000000000000000000000000000000",
};

const CURSOR = "11111111111111111111111111111111111";

export interface BootLayout {
  /** Characters to type, across all lines. */
  chars: number;
  /** Where the cursor sits before each character, and after the last (unit space). */
  cursors: [number, number][];
}

/*
 * Writes xyz and w into `out` for the dots in `slots`: w is the index of the character a dot
 * belongs to, or -1 for the cursor (whose xyz is then an offset from the cursor position).
 * `aspect` is the viewport's width over height; the unit space is 2 tall.
 */
export function layoutBoot(lines: string[], out: Float32Array, slots: Int32Array, aspect: number): BootLayout {
  const longest = Math.max(...lines.map((l) => l.length));
  const cols = longest * 6 - 1;
  const rows = lines.length * 9 - 2;
  const pitch = Math.min((aspect * 2 * 0.8) / cols, (2 * 0.5) / rows, 0.034);
  const top = ((rows - 1) / 2) * pitch;
  const left = (-(longest * 6 - 1) / 2) * pitch;

  const leds: { x: number; y: number; c: number }[] = [];
  const cursors: [number, number][] = [];
  let ci = 0;
  lines.forEach((line, li) => {
    [...line].forEach((ch, k) => {
      const ox = left + k * 6 * pitch;
      const oy = top - li * 9 * pitch;
      cursors.push([ox + 2 * pitch, oy - 3 * pitch]);
      const g = GLYPHS[ch] ?? GLYPHS[" "];
      for (let r = 0; r < g.length / 5; r++) for (let c = 0; c < 5; c++) if (g[r * 5 + c] === "1") leds.push({ x: ox + c * pitch, y: oy - r * pitch, c: ci });
      ci++;
    });
    // After the last character of a line, the cursor waits at the end of that line.
    if (li === lines.length - 1) cursors.push([left + line.length * 6 * pitch + 2 * pitch, top - li * 9 * pitch - 3 * pitch]);
  });

  const cursorShare = Math.floor(slots.length * 0.1);
  const textShare = slots.length - cursorShare;
  const radius = pitch * 0.4;
  let i = 0;
  const disc = (m: number, k: number) => {
    const rr = Math.sqrt((k + 0.5) / m) * radius;
    const an = k * 2.39996323;
    return [Math.cos(an) * rr, Math.sin(an) * rr];
  };

  leds.forEach((l, li) => {
    const m = Math.floor(textShare / leds.length) + (li < textShare % leds.length ? 1 : 0);
    for (let k = 0; k < m; k++, i++) {
      const [dx, dy] = disc(m, k);
      const o = slots[i] * 4;
      out[o] = l.x + dx;
      out[o + 1] = l.y + dy;
      out[o + 2] = 0;
      out[o + 3] = l.c;
    }
  });

  // The cursor: a full 5×7 block, as offsets from its centre.
  const block: [number, number][] = [];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (CURSOR[r * 5 + c] === "1") block.push([(c - 2) * pitch, (3 - r) * pitch]);
  for (let b = 0; i < slots.length; i++, b++) {
    const cell = block[b % block.length];
    const m = Math.ceil(cursorShare / block.length);
    const [dx, dy] = disc(m, Math.floor(b / block.length));
    const o = slots[i] * 4;
    out[o] = cell[0] + dx;
    out[o + 1] = cell[1] + dy;
    out[o + 2] = 0;
    out[o + 3] = -1;
  }

  return { chars: ci, cursors };
}
