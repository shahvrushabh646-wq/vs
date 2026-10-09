import type { Scene, Template } from "./types";
import { CANVAS_H, CANVAS_W } from "./types";
import { applyLook } from "./look";

export type Clip = "rect" | "round" | "arch" | "circle";

export type Slot = {
  x: number;
  y: number;
  w: number;
  h: number;
  asset: number;
  rot?: number;
  clip?: Clip;
  radius?: number;
  focusX?: number;
  focusY?: number;
  scale?: number;
  polaroid?: boolean;
  caption?: boolean;
  mono?: boolean;
  shadow?: boolean;
};

export type TextSpec = {
  role: "kicker" | "title" | "sub" | "meta" | "counter";
  text?: string;
  x: number;
  y: number;
  maxW: number;
  maxH: number;
  size: number;
  align: "left" | "center" | "right";
  weight: number;
  font: "display" | "body";
  color: string;
  maxLines: number;
  italic?: boolean;
  tracking?: number;
  rotate?: number;
  motion?: "rise" | "slide";
};

export type Deco =
  | { layer: "back" | "front"; type: "rect"; x: number; y: number; w: number; h: number; fill: string }
  | { layer: "back" | "front"; type: "shade"; x: number; y: number; w: number; h: number; from: string; to: string }
  | { layer: "front"; type: "letterbox"; color: string; size: number }
  | { layer: "front"; type: "vignette"; strength: number }
  | { layer: "front"; type: "frame"; x: number; y: number; w: number; h: number; color: string; width: number }
  | { layer: "front"; type: "sprockets" }
  | { layer: "front"; type: "line"; x1: number; y1: number; x2: number; y2: number; color: string; width: number }
  | { layer: "front"; type: "circle"; cx: number; cy: number; r: number; color: string; width: number };

export type Composition = {
  bg: string;
  slots: Slot[];
  texts: TextSpec[];
  decos: Deco[];
};

const W = CANVAS_W;
const H = CANVAS_H;

type Ink = { bg: string; fg: string; muted: string; accent: string; panel: string };

const INK: Record<string, Ink> = {
  cinema: { bg: "#07080b", fg: "#f4efe6", muted: "#cfc6b8", accent: "#d9c4a4", panel: "#12141a" },
  paper: { bg: "#f3eee6", fg: "#1b1814", muted: "#5c564c", accent: "#7d322c", panel: "#fffdf9" },
  sacred: { bg: "#110e0a", fg: "#f6edd9", muted: "#d8c7a4", accent: "#c6a15b", panel: "#1b1610" },
  news: { bg: "#0d1014", fg: "#f4f6f8", muted: "#c5ccd4", accent: "#c41820", panel: "#15191e" },
  fest: { bg: "#160b0e", fg: "#fff5e8", muted: "#f0d3b4", accent: "#e6b15a", panel: "#241318" },
  mono: { bg: "#090909", fg: "#f3f3f3", muted: "#bdbdbd", accent: "#ffffff", panel: "#111111" },
  cream: { bg: "#f7f4ef", fg: "#171717", muted: "#5f5a54", accent: "#171717", panel: "#ffffff" },
};

function slot(partial: Partial<Slot> & Pick<Slot, "x" | "y" | "w" | "h">): Slot {
  return { asset: 0, focusX: 0.5, focusY: 0.45, clip: "rect", radius: 0, scale: 1, ...partial };
}

function title(partial: Partial<TextSpec> & Pick<TextSpec, "x" | "y" | "color">): TextSpec {
  return {
    role: "title",
    maxW: 900,
    maxH: 220,
    size: 72,
    align: "left",
    weight: 700,
    font: "display",
    maxLines: 3,
    ...partial,
  };
}

function kicker(text: string, partial: Partial<TextSpec> & Pick<TextSpec, "x" | "y" | "color">): TextSpec {
  return {
    role: "kicker",
    text,
    maxW: 800,
    maxH: 40,
    size: 22,
    align: "left",
    weight: 700,
    font: "body",
    maxLines: 1,
    tracking: 4,
    ...partial,
  };
}

function sub(partial: Partial<TextSpec> & Pick<TextSpec, "x" | "y" | "color">): TextSpec {
  return {
    role: "sub",
    maxW: 800,
    maxH: 80,
    size: 28,
    align: "left",
    weight: 500,
    font: "body",
    maxLines: 2,
    ...partial,
  };
}

function gridSlots(n: number): Slot[] {
  const m = 48;
  const top = 230;
  const bot = 1380;
  const gap = 16;
  if (n <= 1) return [slot({ x: m, y: top, w: W - m * 2, h: bot - top, asset: 0, clip: "round", radius: 18 })];
  if (n === 2) {
    const h = (bot - top - gap) / 2;
    return [0, 1].map((i) =>
      slot({
        x: m,
        y: top + i * (h + gap),
        w: W - m * 2,
        h,
        asset: i,
        clip: "round",
        radius: 16,
        focusX: i ? 0.62 : 0.38,
        focusY: i ? 0.6 : 0.4,
      }),
    );
  }
  const colW = (W - m * 2 - gap) / 2;
  const rowH = (bot - top - gap) / 2;
  if (n === 3) {
    return [
      slot({ x: m, y: top, w: W - m * 2, h: rowH, asset: 0, clip: "round", radius: 16 }),
      slot({ x: m, y: top + rowH + gap, w: colW, h: rowH, asset: 1, clip: "round", radius: 16, focusX: 0.35 }),
      slot({ x: m + colW + gap, y: top + rowH + gap, w: colW, h: rowH, asset: 2, clip: "round", radius: 16, focusX: 0.7 }),
    ];
  }
  return [0, 1, 2, 3].map((i) =>
    slot({
      x: m + (i % 2) * (colW + gap),
      y: top + Math.floor(i / 2) * (rowH + gap),
      w: colW,
      h: rowH,
      asset: i,
      clip: "round",
      radius: 14,
      focusX: 0.32 + (i % 3) * 0.18,
      focusY: 0.36 + (i % 2) * 0.22,
    }),
  );
}

export function compose(template: Template, scene: Scene): Composition {
  return applyLook(layoutOf(template, scene), template);
}

function layoutOf(template: Template, scene: Scene): Composition {
  const n = Math.max(1, scene.assets.length);
  const ink = INK.cinema;
  switch (template.layout) {
    case "dawn":
      return {
        bg: ink.bg,
        slots: [slot({ x: 0, y: 0, w: W, h: H })],
        decos: [
          { layer: "front", type: "shade", x: 0, y: 980, w: W, h: 940, from: "rgba(0,0,0,0)", to: "rgba(0,0,0,.78)" },
          { layer: "front", type: "letterbox", color: "#050506", size: 118 },
        ],
        texts: [
          kicker("CINEMA", { x: 80, y: 1120, color: ink.accent, align: "left" }),
          title({ x: 80, y: 1170, color: ink.fg, size: 78, maxW: 900, maxH: 230 }),
          sub({ x: 80, y: 1420, color: ink.muted, maxW: 760 }),
        ],
      };
    case "focus":
      return {
        bg: "#05060a",
        slots: [slot({ x: 0, y: 0, w: W, h: H, focusY: 0.42 })],
        decos: [
          { layer: "front", type: "vignette", strength: 0.78 },
          { layer: "front", type: "circle", cx: 540, cy: 820, r: 360, color: "rgba(244,239,230,.85)", width: 2 },
        ],
        texts: [
          kicker("FOCUS", { x: 540, y: 1260, color: ink.accent, align: "center" }),
          title({ x: 540, y: 1310, color: "#f7f3ea", size: 68, align: "center", maxW: 860, maxH: 180 }),
        ],
      };
    case "journey":
      return {
        bg: ink.bg,
        slots: [
          slot({ x: 72, y: 240, w: 936, h: 760, clip: "round", radius: 8, focusY: 0.4 }),
          slot({
            x: 72,
            y: 1024,
            w: 936,
            h: 250,
            asset: n > 1 ? 1 : 0,
            clip: "round",
            radius: 8,
            focusY: 0.78,
            scale: n > 1 ? 1 : 1.45,
          }),
        ],
        decos: [{ layer: "front", type: "line", x1: 72, y1: 1004, x2: 360, y2: 1004, color: ink.accent, width: 2 }],
        texts: [
          kicker("JOURNEY", { x: 72, y: 1320, color: ink.accent }),
          title({ x: 72, y: 1368, color: ink.fg, size: 60, maxW: 920, maxH: 150 }),
        ],
      };
    case "meaning":
      return {
        bg: "#050505",
        slots: [slot({ x: 0, y: 0, w: W, h: H, focusY: 0.4 })],
        decos: [{ layer: "front", type: "shade", x: 0, y: 700, w: W, h: 1220, from: "rgba(0,0,0,.05)", to: "rgba(0,0,0,.82)" }],
        texts: [title({ x: 540, y: 1180, color: "#f6f1e8", size: 80, align: "center", maxW: 900, maxH: 280, maxLines: 4 })],
      };
    case "split":
      return {
        bg: "#f6f1e8",
        slots: [slot({ x: 450, y: 0, w: 630, h: H, focusX: 0.55 })],
        decos: [{ layer: "back", type: "rect", x: 0, y: 0, w: 450, h: H, fill: "#f6f1e8" }],
        texts: [
          kicker("EDITORIAL", { x: 64, y: 280, color: "#7d322c" }),
          title({ x: 64, y: 360, color: "#1b1814", size: 58, maxW: 340, maxH: 520, maxLines: 6 }),
          sub({ x: 64, y: 980, color: "#5c564c", maxW: 340, maxH: 120 }),
          { role: "counter", x: 64, y: 1280, color: "#1b1814", maxW: 200, maxH: 80, size: 42, align: "left", weight: 700, font: "body", maxLines: 1 },
        ],
      };
    case "column":
      return {
        bg: "#f3eee6",
        slots: [slot({ x: 390, y: 220, w: 620, h: 1320, clip: "rect" })],
        decos: [{ layer: "front", type: "line", x1: 80, y1: 250, x2: 80, y2: 1480, color: "#7d322c", width: 3 }],
        texts: [
          kicker("COLUMN", { x: 108, y: 260, color: "#7d322c", maxW: 250 }),
          title({ x: 108, y: 330, color: "#1b1814", size: 52, maxW: 250, maxH: 760, maxLines: 8 }),
          sub({ x: 108, y: 1160, color: "#5c564c", maxW: 250, size: 22 }),
        ],
      };
    case "eframe":
      return {
        bg: "#f7f4ef",
        slots: [slot({ x: 120, y: 250, w: 840, h: 980 })],
        decos: [
          { layer: "front", type: "frame", x: 96, y: 226, w: 888, h: 1028, color: "#1b1814", width: 2 },
          { layer: "front", type: "frame", x: 78, y: 208, w: 924, h: 1064, color: "#1b1814", width: 1 },
        ],
        texts: [
          kicker("FRAME", { x: 120, y: 1320, color: "#7d322c" }),
          title({ x: 120, y: 1368, color: "#1b1814", size: 52, maxW: 840, maxH: 140 }),
        ],
      };
    case "estory":
      return {
        bg: "#f4efe6",
        slots: [slot({ x: 72, y: 220, w: 936, h: 640 })],
        decos: [{ layer: "front", type: "line", x1: 72, y1: 900, x2: 280, y2: 900, color: "#7d322c", width: 2 }],
        texts: [
          kicker("STORY", { x: 72, y: 930, color: "#7d322c" }),
          title({ x: 72, y: 980, color: "#1b1814", size: 64, maxW: 920, maxH: 200 }),
          sub({ x: 72, y: 1220, color: "#5c564c", maxW: 860, maxH: 120, maxLines: 3 }),
          { role: "meta", text: "FIELD NOTE", x: 72, y: 1420, color: "#1b1814", maxW: 700, maxH: 36, size: 18, align: "left", weight: 700, font: "body", maxLines: 1, tracking: 3 },
        ],
      };
    case "cover":
      return {
        bg: "#101114",
        slots: [slot({ x: 0, y: 300, w: W, h: 980 })],
        decos: [
          { layer: "back", type: "rect", x: 0, y: 0, w: W, h: H, fill: "#101114" },
          { layer: "front", type: "shade", x: 0, y: 980, w: W, h: 420, from: "rgba(0,0,0,0)", to: "rgba(0,0,0,.55)" },
        ],
        texts: [
          kicker("COVER", { x: 540, y: 236, color: "#f4efe6", align: "center", maxW: 900, size: 24 }),
          title({ x: 72, y: 1180, color: "#f4efe6", size: 86, maxW: 940, maxH: 220 }),
          sub({ x: 72, y: 1420, color: "#d9c4a4", maxW: 800 }),
        ],
      };
    case "feature":
      return {
        bg: "#f6f1e8",
        slots: [slot({ x: 0, y: 0, w: W, h: 860 })],
        decos: [{ layer: "front", type: "line", x1: 72, y1: 900, x2: 240, y2: 900, color: "#7d322c", width: 3 }],
        texts: [
          kicker("FEATURE", { x: 72, y: 930, color: "#7d322c" }),
          title({ x: 72, y: 990, color: "#1b1814", size: 64, maxW: 920, maxH: 210 }),
          sub({ x: 72, y: 1240, color: "#5c564c", maxW: 860, maxLines: 3, maxH: 140 }),
        ],
      };
    case "mbold":
      return {
        bg: "#0c0d10",
        slots: [slot({ x: 0, y: 0, w: W, h: H, focusX: 0.72 })],
        decos: [{ layer: "front", type: "shade", x: 0, y: 0, w: 760, h: H, from: "rgba(8,8,10,.88)", to: "rgba(8,8,10,.15)" }],
        texts: [
          kicker("BOLD", { x: 72, y: 520, color: "#d9c4a4" }),
          title({ x: 72, y: 580, color: "#f7f3ea", size: 92, maxW: 620, maxH: 640, maxLines: 5 }),
        ],
      };
    case "polaroid": {
      const slots: Slot[] = [];
      if (n > 1) {
        slots.push(slot({ x: 170, y: 280, w: 700, h: 820, asset: 1, rot: -7, shadow: true, focusY: 0.4 }));
      }
      slots.push(slot({ x: 210, y: 390, w: 680, h: 760, asset: 0, rot: 4, polaroid: true, caption: true, shadow: true }));
      return {
        bg: "#c9c0b4",
        slots,
        decos: [],
        texts: [kicker("MEMORY", { x: 540, y: 1460, color: "#2a241c", align: "center" })],
      };
    }
    case "diary":
      return {
        bg: "#efe4d2",
        slots: [slot({ x: 150, y: 300, w: 780, h: 860, shadow: true })],
        decos: [
          { layer: "front", type: "rect", x: 430, y: 270, w: 180, h: 36, fill: "rgba(196,168,120,.85)" },
          { layer: "front", type: "line", x1: 160, y1: 1220, x2: 900, y2: 1220, color: "rgba(60,40,20,.25)", width: 1 },
        ],
        texts: [
          kicker("DIARY", { x: 150, y: 1280, color: "#7d322c" }),
          title({ x: 150, y: 1330, color: "#2a2118", size: 48, maxW: 780, maxH: 140, italic: true }),
        ],
      };
    case "scrapbook": {
      const places = [
        { x: 120, y: 250, w: 640, h: 760, rot: -6 },
        { x: 400, y: 560, w: 560, h: 680, rot: 5 },
        { x: 140, y: 980, w: 480, h: 360, rot: -2 },
      ];
      return {
        bg: "#e7dcc8",
        slots: places.slice(0, n).map((place, index) => slot({ ...place, asset: index, polaroid: true, shadow: true })),
        decos: [],
        texts: [kicker("SCRAPBOOK", { x: 72, y: 230, color: "#3a3128", size: 18 })],
      };
    }
    case "grid":
      return {
        bg: "#101114",
        slots: gridSlots(n),
        decos: [],
        texts: [
          kicker("COLLAGE", { x: 48, y: 1420, color: "#d9c4a4" }),
          title({ x: 48, y: 1460, color: "#f4efe6", size: 40, maxW: 980, maxH: 80, maxLines: 2 }),
        ],
      };
    case "dgrid": {
      const top = 220;
      const bot = 1380;
      const gap = 14;
      const slots: Slot[] =
        n === 1
          ? [slot({ x: 48, y: top, w: W - 96, h: bot - top, clip: "round", radius: 12 })]
          : n === 2
            ? [
                slot({ x: 48, y: top, w: 560, h: bot - top, clip: "round", radius: 12 }),
                slot({ x: 622, y: top, w: 410, h: bot - top, asset: 1, clip: "round", radius: 12, focusX: 0.6 }),
              ]
            : [
                slot({ x: 48, y: top, w: 620, h: bot - top, clip: "round", radius: 12 }),
                slot({ x: 682, y: top, w: 350, h: (bot - top - gap) / 2, asset: 1, clip: "round", radius: 12, focusY: 0.35 }),
                slot({
                  x: 682,
                  y: top + (bot - top - gap) / 2 + gap,
                  w: 350,
                  h: (bot - top - gap) / 2,
                  asset: 2,
                  clip: "round",
                  radius: 12,
                  focusY: 0.7,
                }),
              ];
      return {
        bg: "#12141a",
        slots,
        decos: [],
        texts: [title({ x: 48, y: 1420, color: "#f4efe6", size: 42, maxW: 980, maxH: 90, maxLines: 2 })],
      };
    }
    case "wall": {
      const places = [
        { x: 60, y: 230, w: 680, h: 860, rot: -3 },
        { x: 430, y: 480, w: 580, h: 720, rot: 4 },
        { x: 80, y: 980, w: 500, h: 380, rot: -2 },
        { x: 540, y: 1080, w: 460, h: 300, rot: 3 },
      ];
      return {
        bg: "#1a1714",
        slots: places.slice(0, n).map((place, index) => slot({ ...place, asset: index, shadow: true })),
        decos: [{ layer: "front", type: "shade", x: 0, y: 1320, w: W, h: 280, from: "rgba(16,12,10,0)", to: "rgba(16,12,10,.92)" }],
        texts: [title({ x: 72, y: 1420, color: "#f6f1e8", size: 48, maxW: 920, maxH: 110 })],
      };
    }
    case "mframe": {
      const slots: Slot[] =
        n === 1
          ? [slot({ x: 64, y: 220, w: 952, h: 1180 })]
          : n === 2
            ? [
                slot({ x: 64, y: 220, w: 952, h: 760 }),
                slot({ x: 64, y: 1000, w: 952, h: 380, asset: 1, focusY: 0.7 }),
              ]
            : [
                slot({ x: 64, y: 220, w: 952, h: 720 }),
                slot({ x: 64, y: 960, w: 466, h: 400, asset: 1, focusX: 0.4 }),
                slot({ x: 550, y: 960, w: 466, h: 400, asset: 2, focusX: 0.65 }),
              ];
      return {
        bg: "#f3eee6",
        slots,
        decos: slots.map((item) => ({
          layer: "front" as const,
          type: "frame" as const,
          x: item.x - 8,
          y: item.y - 8,
          w: item.w + 16,
          h: item.h + 16,
          color: "#1b1814",
          width: 2,
        })),
        texts: [title({ x: 64, y: 1420, color: "#1b1814", size: 46, maxW: 940, maxH: 100 })],
      };
    }
    case "sacred":
      return {
        bg: INK.sacred.bg,
        slots: [slot({ x: 150, y: 240, w: 780, h: 1040, clip: "arch" })],
        decos: [{ layer: "front", type: "frame", x: 132, y: 220, w: 816, h: 1080, color: INK.sacred.accent, width: 2 }],
        texts: [
          title({ x: 540, y: 1360, color: INK.sacred.fg, align: "center", size: 54, maxW: 860, maxH: 120 }),
          sub({ x: 540, y: 1490, color: INK.sacred.muted, align: "center", maxW: 760, size: 24 }),
        ],
      };
    case "temple":
      return {
        bg: "#140e09",
        slots: [slot({ x: 0, y: 0, w: W, h: H, focusY: 0.35 })],
        decos: [
          { layer: "front", type: "shade", x: 180, y: 0, w: 720, h: 640, from: "rgba(230,190,120,.28)", to: "rgba(230,190,120,0)" },
          { layer: "front", type: "shade", x: 0, y: 1100, w: W, h: 820, from: "rgba(0,0,0,0)", to: "rgba(0,0,0,.8)" },
          { layer: "front", type: "line", x1: 390, y1: 1320, x2: 690, y2: 1320, color: "#c6a15b", width: 1 },
        ],
        texts: [
          kicker("TEMPLE", { x: 540, y: 1340, color: "#c6a15b", align: "center" }),
          title({ x: 540, y: 1390, color: "#f6edd9", align: "center", size: 60, maxW: 880, maxH: 140 }),
        ],
      };
    case "devotional":
      return {
        bg: INK.sacred.bg,
        slots: [slot({ x: 250, y: 280, w: 580, h: 980, clip: "round", radius: 40 })],
        decos: [{ layer: "front", type: "frame", x: 230, y: 260, w: 620, h: 1020, color: INK.sacred.accent, width: 1 }],
        texts: [
          kicker("DEVOTION", { x: 540, y: 1320, color: INK.sacred.accent, align: "center" }),
          title({ x: 540, y: 1370, color: INK.sacred.fg, align: "center", size: 46, maxW: 860, maxH: 140 }),
        ],
      };
    case "energy":
      return {
        bg: INK.fest.bg,
        slots: [slot({ x: 0, y: 0, w: W, h: H })],
        decos: [
          { layer: "front", type: "rect", x: 0, y: 220, w: W, h: 14, fill: INK.fest.accent },
          { layer: "front", type: "shade", x: 0, y: 1000, w: W, h: 920, from: "rgba(0,0,0,0)", to: "rgba(12,4,6,.88)" },
        ],
        texts: [
          { role: "counter", x: 72, y: 1100, color: INK.fest.accent, maxW: 300, maxH: 70, size: 48, align: "left", weight: 700, font: "body", maxLines: 1 },
          title({ x: 72, y: 1180, color: INK.fest.fg, size: 84, maxW: 940, maxH: 240, maxLines: 3 }),
        ],
      };
    case "burst":
      return {
        bg: "#1a0c10",
        slots: [slot({ x: 70, y: 250, w: 940, h: 980, rot: -7, shadow: true })],
        decos: [{ layer: "back", type: "rect", x: 620, y: 180, w: 520, h: 1500, fill: "#3a1820" }],
        texts: [
          kicker("FESTIVAL", { x: 72, y: 1280, color: INK.fest.accent }),
          title({ x: 72, y: 1330, color: "#fff5e8", size: 72, maxW: 940, maxH: 180 }),
        ],
      };
    case "crowd":
      return {
        bg: "#070707",
        slots: [slot({ x: 0, y: 0, w: W, h: H, scale: 1.18, focusY: 0.48 })],
        decos: [{ layer: "front", type: "shade", x: 0, y: 1280, w: W, h: 640, from: "rgba(0,0,0,0)", to: "rgba(0,0,0,.75)" }],
        texts: [title({ x: 72, y: 1420, color: "#f4efe6", size: 54, maxW: 920, maxH: 100, maxLines: 2 })],
      };
    case "doc":
      return {
        bg: "#141210",
        slots: [slot({ x: 86, y: 230, w: 908, h: 900 })],
        decos: [
          { layer: "front", type: "sprockets" },
          { layer: "front", type: "frame", x: 70, y: 214, w: 940, h: 932, color: "#d9d0c3", width: 1 },
        ],
        texts: [
          kicker("DOCUMENTARY", { x: 86, y: 1180, color: "#d9c4a4" }),
          title({ x: 86, y: 1230, color: "#f4efe6", size: 52, maxW: 900, maxH: 160 }),
          { role: "meta", text: "FIELD RECORD", x: 86, y: 1440, color: "#cfc6b8", maxW: 700, maxH: 36, size: 18, align: "left", weight: 700, font: "body", maxLines: 1, tracking: 3 },
        ],
      };
    case "timeline":
      return {
        bg: "#f3eee6",
        slots: [slot({ x: 180, y: 250, w: 840, h: 900 })],
        decos: [
          { layer: "front", type: "line", x1: 96, y1: 240, x2: 96, y2: 1500, color: "#7d322c", width: 2 },
          { layer: "front", type: "circle", cx: 96, cy: 360, r: 7, color: "#7d322c", width: 8 },
          { layer: "front", type: "circle", cx: 96, cy: 980, r: 7, color: "#7d322c", width: 8 },
        ],
        texts: [
          { role: "counter", x: 140, y: 1220, color: "#7d322c", maxW: 200, maxH: 60, size: 36, align: "left", weight: 700, font: "body", maxLines: 1 },
          title({ x: 140, y: 1280, color: "#1b1814", size: 48, maxW: 860, maxH: 160 }),
        ],
      };
    case "journal":
      return {
        bg: "#f6f1e8",
        slots: [slot({ x: 360, y: 230, w: 660, h: 1240 })],
        decos: [{ layer: "front", type: "line", x1: 330, y1: 240, x2: 330, y2: 1480, color: "rgba(80,60,40,.35)", width: 1 }],
        texts: [
          kicker("NOTES", { x: 56, y: 260, color: "#7d322c", maxW: 250 }),
          title({ x: 56, y: 340, color: "#1b1814", size: 40, maxW: 250, maxH: 640, maxLines: 8 }),
          sub({ x: 56, y: 1100, color: "#5c564c", maxW: 250, size: 20, maxH: 160 }),
        ],
      };
    case "hframe":
      return {
        bg: "#16110c",
        slots: [slot({ x: 140, y: 270, w: 800, h: 980 })],
        decos: [
          { layer: "front", type: "frame", x: 110, y: 240, w: 860, h: 1040, color: "#c6a15b", width: 2 },
          { layer: "front", type: "frame", x: 92, y: 222, w: 896, h: 1076, color: "#c6a15b", width: 1 },
        ],
        texts: [
          kicker("HERITAGE", { x: 540, y: 1360, color: "#c6a15b", align: "center" }),
          title({ x: 540, y: 1410, color: "#f6edd9", align: "center", size: 46, maxW: 860, maxH: 110 }),
        ],
      };
    case "minimal":
      return {
        bg: "#f7f4ef",
        slots: [slot({ x: 140, y: 400, w: 800, h: 860 })],
        decos: [],
        texts: [
          kicker("NOTE", { x: 140, y: 280, color: "#7a756c", size: 16 }),
          title({ x: 140, y: 1320, color: "#171717", size: 46, maxW: 800, maxH: 140 }),
        ],
      };
    case "quote":
      return {
        bg: "#0c0c0c",
        slots: [slot({ x: 0, y: 0, w: W, h: H })],
        decos: [{ layer: "front", type: "shade", x: 0, y: 0, w: W, h: H, from: "rgba(0,0,0,.55)", to: "rgba(0,0,0,.72)" }],
        texts: [
          { role: "kicker", text: "“", x: 100, y: 640, color: "rgba(255,255,255,.85)", maxW: 200, maxH: 120, size: 100, align: "left", weight: 500, font: "display", maxLines: 1 },
          title({ x: 540, y: 820, color: "#f7f4ef", align: "center", size: 60, maxW: 840, maxH: 360, maxLines: 5 }),
        ],
      };
    case "mono":
      return {
        bg: "#050505",
        slots: [slot({ x: 0, y: 0, w: 700, h: H, mono: true })],
        decos: [{ layer: "back", type: "rect", x: 700, y: 0, w: 380, h: H, fill: "#050505" }],
        texts: [
          title({
            x: 890,
            y: 980,
            color: "#f5f5f5",
            size: 54,
            maxW: 980,
            maxH: 140,
            align: "center",
            rotate: -90,
            maxLines: 2,
          }),
        ],
      };
    case "kinetic":
      return {
        bg: "#0e1014",
        slots: [slot({ x: 0, y: 860, w: W, h: 1060 })],
        decos: [{ layer: "back", type: "rect", x: 0, y: 0, w: W, h: 860, fill: "#0e1014" }],
        texts: [
          kicker("CAPTION", { x: 72, y: 250, color: "#d9c4a4" }),
          title({ x: 72, y: 320, color: "#f4efe6", size: 92, maxW: 940, maxH: 420, maxLines: 4, motion: "slide" }),
        ],
      };
    case "dcrop": {
      const wide = scene.index % 2 === 0;
      if (wide) {
        return {
          bg: "#07080b",
          slots: [slot({ x: 0, y: 250, w: W, h: 860, scale: 1.22, focusY: 0.38 + (scene.index % 3) * 0.06 })],
          decos: [{ layer: "back", type: "rect", x: 0, y: 0, w: W, h: H, fill: "#07080b" }],
          texts: [
            kicker("WIDE CROP", { x: 72, y: 1180, color: "#d9c4a4" }),
            title({ x: 72, y: 1230, color: "#f4efe6", size: 64, maxW: 920, maxH: 200 }),
          ],
        };
      }
      return {
        bg: "#07080b",
        slots: [slot({ x: 160, y: 220, w: 760, h: 1180, scale: 1.3, focusX: scene.index % 3 === 0 ? 0.32 : 0.7 })],
        decos: [{ layer: "back", type: "rect", x: 0, y: 0, w: W, h: H, fill: "#07080b" }],
        texts: [
          kicker("TIGHT CROP", { x: 72, y: 1430, color: "#d9c4a4" }),
          title({ x: 72, y: 1472, color: "#f4efe6", size: 36, maxW: 920, maxH: 70, maxLines: 2 }),
        ],
      };
    }
    case "news":
      return {
        bg: INK.news.bg,
        slots: [slot({ x: 0, y: 310, w: W, h: 820 })],
        decos: [
          { layer: "front", type: "rect", x: 0, y: 220, w: W, h: 78, fill: INK.news.accent },
          { layer: "back", type: "rect", x: 0, y: 1140, w: W, h: 280, fill: "#0a0c0f" },
        ],
        texts: [
          kicker("CULTURE DESK", { x: 28, y: 242, color: "#ffffff", maxW: 700, size: 26 }),
          title({ x: 36, y: 1180, color: "#f4f6f8", size: 52, maxW: 1000, maxH: 170 }),
          sub({ x: 36, y: 1440, color: "#c5ccd4", maxW: 980, size: 24 }),
        ],
      };
    case "vlabel":
      return {
        bg: "#07080b",
        slots: [slot({ x: 0, y: 0, w: W, h: H, focusX: 0.58 })],
        decos: [{ layer: "front", type: "shade", x: 0, y: 0, w: 280, h: H, from: "rgba(0,0,0,.78)", to: "rgba(0,0,0,0)" }],
        texts: [
          title({
            x: 150,
            y: 1040,
            color: "#f4efe6",
            size: 48,
            maxW: 1100,
            maxH: 120,
            align: "center",
            rotate: -90,
            maxLines: 2,
          }),
        ],
      };
    case "sacredoc":
      return {
        bg: INK.sacred.bg,
        slots: [slot({ x: 150, y: 230, w: 780, h: 920, clip: "arch" })],
        decos: [
          { layer: "front", type: "frame", x: 132, y: 210, w: 816, h: 960, color: INK.sacred.accent, width: 2 },
          { layer: "front", type: "rect", x: 96, y: 1240, w: 888, h: 250, fill: "#f3eee6" },
        ],
        texts: [
          kicker("RECORD", { x: 130, y: 1270, color: "#7d322c" }),
          title({ x: 130, y: 1320, color: "#1b1814", size: 40, maxW: 820, maxH: 130 }),
        ],
      };
    case "cards":
      return {
        bg: "#1a120e",
        slots: [slot({ x: 130, y: 300, w: 820, h: 760 })],
        decos: [
          { layer: "back", type: "rect", x: 80, y: 230, w: 920, h: 1280, fill: "#f6f1e8" },
        ],
        texts: [
          kicker("CARD", { x: 130, y: 1100, color: "#7d322c" }),
          title({ x: 130, y: 1150, color: "#1b1814", size: 52, maxW: 820, maxH: 180 }),
          sub({ x: 130, y: 1360, color: "#5c564c", maxW: 760 }),
        ],
      };
    case "finale":
      return {
        bg: "#070707",
        slots: [slot({ x: 140, y: 280, w: 800, h: 700 })],
        decos: [{ layer: "front", type: "line", x1: 360, y1: 1040, x2: 720, y2: 1040, color: "#d9c4a4", width: 1 }],
        texts: [
          title({ x: 540, y: 1100, color: "#f4efe6", align: "center", size: 78, maxW: 920, maxH: 240, maxLines: 3 }),
          kicker("CLOSE", { x: 540, y: 1420, color: "#d9c4a4", align: "center", maxW: 800 }),
        ],
      };
    default:
      return {
        bg: ink.bg,
        slots: [slot({ x: 0, y: 0, w: W, h: H })],
        decos: [],
        texts: [title({ x: 80, y: 1300, color: ink.fg })],
      };
  }
}
