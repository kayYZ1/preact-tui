import type { Position } from "../../preact/src/types";

type BorderStyle = "straight" | "dash";

const BORDER_CHARS: Record<BorderStyle, { h: string; v: string; tl: string; tr: string; bl: string; br: string }> = {
  straight: { h: "─", v: "│", tl: "┌", tr: "┐", bl: "└", br: "┘" },
  dash: { h: "┄", v: "┆", tl: "┌", tr: "┐", bl: "└", br: "┘" },
};

export const drawBox = (
  x: number,
  y: number,
  w: number,
  h: number,
  style: BorderStyle = "straight",
  color?: string,
  thickness = 1,
): Position[] => {
  if (w < 2 || h < 2) return [];

  const chars = BORDER_CHARS[style];
  const positions: Position[] = [];

  const wrap = (char: string) => {
    if (!color) return char;
    const ansi = Bun.color(color, "ansi");
    return ansi ? `${ansi}${char}\x1b[0m` : char;
  };

  for (let t = 0; t < thickness; t++) {
    const cx = x + t;
    const cy = y + t;
    const cw = w - t * 2;
    const ch = h - t * 2;

    if (cw < 2 || ch < 2) break;

    positions.push({ x: cx, y: cy, text: wrap(chars.tl) });
    positions.push({ x: cx + cw - 1, y: cy, text: wrap(chars.tr) });
    positions.push({ x: cx, y: cy + ch - 1, text: wrap(chars.bl) });
    positions.push({ x: cx + cw - 1, y: cy + ch - 1, text: wrap(chars.br) });

    for (let i = 1; i < cw - 1; i++) {
      positions.push({ x: cx + i, y: cy, text: wrap(chars.h) });
      positions.push({ x: cx + i, y: cy + ch - 1, text: wrap(chars.h) });
    }

    for (let i = 1; i < ch - 1; i++) {
      positions.push({ x: cx, y: cy + i, text: wrap(chars.v) });
      positions.push({ x: cx + cw - 1, y: cy + i, text: wrap(chars.v) });
    }
  }

  return positions;
};
