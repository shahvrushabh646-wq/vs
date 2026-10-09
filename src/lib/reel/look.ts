import type { Composition, Deco, TextSpec } from "./compose";
import { reelCopy } from "./copy";
import type { PaletteId, Template } from "./types";
import { CANVAS_H, CANVAS_W } from "./types";

type Ink = { bg: string; fg: string; muted: string; accent: string; panel: string; name: string };

export const PALETTES: Record<PaletteId, Ink> = {
  gold: { name: "Gold Hour", bg: "#100e0b", fg: "#f6efe4", muted: "#d9cbb6", accent: "#e0b15a", panel: "#1c1812" },
  ivory: { name: "Ivory Page", bg: "#f4efe6", fg: "#1c1914", muted: "#5e564c", accent: "#8a3a32", panel: "#fffaf3" },
  brass: { name: "Temple Brass", bg: "#14110c", fg: "#f6edd9", muted: "#d8c7a4", accent: "#c6a15b", panel: "#221c14" },
  teal: { name: "Monsoon", bg: "#071416", fg: "#e7f4f2", muted: "#b7d0cb", accent: "#3ec2b0", panel: "#102226" },
  vermilion: { name: "Vermilion", bg: "#16090b", fg: "#fff1e8", muted: "#f0c7b4", accent: "#e23b2f", panel: "#2a1214" },
  charcoal: { name: "Charcoal", bg: "#0c0c0c", fg: "#f3f3f3", muted: "#bdbdbd", accent: "#ffffff", panel: "#161616" },
  sandal: { name: "Sandal", bg: "#f3e6d4", fg: "#2a2118", muted: "#6b5846", accent: "#8d4b2a", panel: "#fff6ea" },
  indigo: { name: "Indigo", bg: "#0c1020", fg: "#eef1ff", muted: "#c5cbe6", accent: "#8ea2ff", panel: "#161b33" },
  marigold: { name: "Marigold", bg: "#1a1206", fg: "#fff6df", muted: "#f0d7a4", accent: "#f0a202", panel: "#2c1e0a" },
  slate: { name: "Slate", bg: "#101418", fg: "#eef2f5", muted: "#c5ced6", accent: "#7f93a6", panel: "#1a2128" },
  rose: { name: "Rose Dusk", bg: "#1a1014", fg: "#ffeef3", muted: "#f0c9d2", accent: "#e07a9a", panel: "#2a1820" },
  forest: { name: "Forest", bg: "#0d140f", fg: "#eef6ee", muted: "#c5d6c6", accent: "#7dbe74", panel: "#172018" },
  cream: { name: "Cream", bg: "#f7f4ef", fg: "#171717", muted: "#5f5a54", accent: "#1f1f1f", panel: "#ffffff" },
  night: { name: "Night Cut", bg: "#07080b", fg: "#f4efe6", muted: "#cfc6b8", accent: "#d9c4a4", panel: "#12141a" },
  copper: { name: "Copper", bg: "#1a100c", fg: "#fff1e6", muted: "#e6cbb8", accent: "#d4784a", panel: "#2a1a14" },
};

export const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function luminance(hex: string): number {
  const raw = hex.replace("#", "");
  if (raw.length < 6) return 0;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  if ([r, g, b].some((part) => Number.isNaN(part))) return 0;
  return r * 0.3 + g * 0.59 + b * 0.11;
}

function tintDeco(deco: Deco, ink: Ink, paper: boolean): Deco {
  if (deco.type === "rect") {
    if (deco.h <= 24 || deco.w <= 24) return { ...deco, fill: ink.accent };
    if (paper || deco.w > 400) return { ...deco, fill: deco.y < 40 && deco.h < 120 ? ink.accent : ink.panel };
    return deco;
  }
  if (deco.type === "frame" || deco.type === "line") return { ...deco, color: ink.accent };
  if (deco.type === "letterbox") return { ...deco, color: ink.bg };
  if (deco.type === "circle" && deco.r < 24) return { ...deco, color: ink.accent };
  return deco;
}

function signature(variant: number, ink: Ink, paper: boolean): Deco[] {
  // A restrained editorial finish: no oversized bars or heavy letterboxes.
  // Keep the template's own palette while adding depth and a fine inset frame.
  const inset = 30 + (variant % 4) * 3;
  const lineLength = 96 + (variant % 5) * 16;
  return [
    { layer: "front", type: "vignette", strength: paper ? 0.1 : 0.24 },
    {
      layer: "front",
      type: "frame",
      x: inset,
      y: inset,
      w: CANVAS_W - inset * 2,
      h: CANVAS_H - inset * 2,
      color: ink.accent,
      width: 2,
    },
    {
      layer: "front",
      type: "line",
      x1: 72,
      y1: 154,
      x2: 72 + lineLength,
      y2: 154,
      color: ink.accent,
      width: 3,
    },
  ];
}

function paintText(spec: TextSpec, ink: Ink, paper: boolean, template: Template): TextSpec {
  const fallback = spec.role === "kicker" ? template.category : "";
  const text = spec.text ? reelCopy(spec.text, fallback) : spec.text;
  const color =
    spec.role === "kicker" || spec.role === "counter"
      ? ink.accent
      : paper
        ? spec.role === "title"
          ? ink.fg
          : ink.muted
        : spec.color;
  return {
    ...spec,
    text,
    color,
    size: Math.max(16, Math.round(spec.size * (0.92 + (template.variant % 5) * 0.03))),
  };
}

/** Applies the template's palette, frame, and crop so each reel actually looks different. */
export function applyLook(composition: Composition, template: Template): Composition {
  const ink = PALETTES[template.palette] ?? PALETTES.night;
  const paper = luminance(composition.bg) > 150;
  const variant = template.variant || 0;
  return {
    bg: ink.bg,
    slots: composition.slots.map((item, index) => {
      const full = item.w > 1000 && item.h > 1700;
      const inset = full ? 0 : (variant % 3) * 8;
      let w = Math.max(140, item.w - inset);
      let h = Math.max(140, item.h - inset);
      let x = item.x + (full ? 0 : ((variant + index * 3) % 5) - 2) * 10;
      let y = item.y + (full ? 0 : ((variant * 2 + index) % 5) - 2) * 12;
      if (item.polaroid) {
        x = clamp(x, 48, CANVAS_W - w - 48);
        y = clamp(y, 80, CANVAS_H - h - 160);
      } else {
        x = clamp(x, 0, CANVAS_W - w);
        y = clamp(y, 0, CANVAS_H - h);
      }
      const radius = item.clip === "arch" || item.clip === "circle" ? item.radius : (item.radius ?? 0) + (variant % 4) * 8;
      return {
        ...item,
        x,
        y,
        w,
        h,
        radius,
        clip: item.clip === "arch" || item.clip === "circle" ? item.clip : (radius ?? 0) > 10 ? "round" : item.clip,
        focusX: clamp((item.focusX ?? 0.5) + ((variant % 7) - 3) * 0.035, 0.18, 0.82),
        focusY: clamp((item.focusY ?? 0.45) + ((variant % 5) - 2) * 0.03, 0.2, 0.8),
        mono: Boolean(item.mono || (template.palette === "charcoal" && variant % 2 === 0)),
        rot: item.rot ? item.rot + ((variant % 5) - 2) * 0.6 : item.rot,
      };
    }),
    texts: composition.texts.map((spec) => paintText(spec, ink, paper, template)),
    decos: composition.decos.map((deco) => tintDeco(deco, ink, paper)).concat(signature(variant, ink, paper)),
  };
}
