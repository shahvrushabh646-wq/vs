import type { Composition, Deco, Slot, TextSpec } from "./compose";
import { compose } from "./compose";
import { reelCopy } from "./copy";
import { locate, sceneDurations, transitionSeconds } from "./sequence";
import type { MediaAsset, Speed, Template } from "./types";
import { CANVAS_H, CANVAS_W, SAFE } from "./types";

export type PaintInput = {
  template: Template;
  scenes: { index: number; role: string; label: string; assets: MediaAsset[] }[];
  time: number;
  duration: number;
  speed: Speed;
  title: string;
  fontFamily: string;
  fontScale: number;
  demo: boolean;
  strict: boolean;
  bitmap: (asset: MediaAsset) => CanvasImageSource | null;
};

export type PaintResult = {
  sceneIndex: number;
  drewMedia: boolean;
  missingTitle?: string;
};

const PLATES = ["#2c241c|#8a6232|#e4c48a", "#151a22|#3c4c63|#d5dbe6", "#2a1416|#7a3834|#e2b48e", "#1c1914|#5a5146|#d9d0c2"];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function sourceSize(src: CanvasImageSource): { w: number; h: number } {
  if (src instanceof HTMLVideoElement) return { w: src.videoWidth, h: src.videoHeight };
  if (src instanceof HTMLImageElement) return { w: src.naturalWidth, h: src.naturalHeight };
  if (src instanceof HTMLCanvasElement) return { w: src.width, h: src.height };
  if (typeof ImageBitmap !== "undefined" && src instanceof ImageBitmap) return { w: src.width, h: src.height };
  const box = src as { width?: number; videoWidth?: number; height?: number; videoHeight?: number };
  return { w: box.videoWidth || box.width || 0, h: box.videoHeight || box.height || 0 };
}

function roundPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function clipSlot(ctx: CanvasRenderingContext2D, slot: Slot) {
  ctx.beginPath();
  if (slot.clip === "circle") {
    ctx.arc(slot.x + slot.w / 2, slot.y + slot.h / 2, Math.min(slot.w, slot.h) / 2, 0, Math.PI * 2);
  } else if (slot.clip === "arch") {
    ctx.moveTo(slot.x, slot.y + slot.h);
    ctx.lineTo(slot.x, slot.y + slot.h * 0.4);
    ctx.bezierCurveTo(slot.x, slot.y, slot.x + slot.w, slot.y, slot.x + slot.w, slot.y + slot.h * 0.4);
    ctx.lineTo(slot.x + slot.w, slot.y + slot.h);
    ctx.closePath();
  } else if (slot.clip === "round" || (slot.radius ?? 0) > 0) {
    roundPath(ctx, slot.x, slot.y, slot.w, slot.h, slot.radius ?? 16);
  } else {
    ctx.rect(slot.x, slot.y, slot.w, slot.h);
  }
}

function cover(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  focusX: number,
  focusY: number,
  scale: number,
): boolean {
  const { w: sw, h: sh } = sourceSize(src);
  if (sw < 2 || sh < 2 || dw < 2 || dh < 2) return false;
  const safeScale = Math.max(1, scale);
  const destAspect = dw / dh;
  const srcAspect = sw / sh;
  let sWidth: number;
  let sHeight: number;
  if (srcAspect > destAspect) {
    sHeight = sh / safeScale;
    sWidth = sHeight * destAspect;
  } else {
    sWidth = sw / safeScale;
    sHeight = sWidth / destAspect;
  }
  sWidth = Math.min(sWidth, sw);
  sHeight = Math.min(sHeight, sh);
  const maxX = Math.max(0, sw - sWidth);
  const maxY = Math.max(0, sh - sHeight);
  const sx = clamp(maxX * clamp(focusX, 0, 1), 0, maxX);
  const sy = clamp(maxY * clamp(focusY, 0, 1), 0, maxY);
  ctx.drawImage(src, sx, sy, sWidth, sHeight, dx, dy, dw, dh);
  return true;
}

function drawPlate(ctx: CanvasRenderingContext2D, slot: Slot, seed: number) {
  const raw = PLATES[Math.abs(seed) % PLATES.length] ?? PLATES[0]!;
  const tone = raw.split("|");
  const gradient = ctx.createLinearGradient(slot.x, slot.y, slot.x + slot.w, slot.y + slot.h);
  gradient.addColorStop(0, tone[0] || "#2c241c");
  gradient.addColorStop(0.55, tone[1] || "#8a6232");
  gradient.addColorStop(1, tone[2] || "#e4c48a");
  ctx.fillStyle = gradient;
  ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
  ctx.fillStyle = "rgba(0,0,0,.28)";
  ctx.fillRect(slot.x + slot.w * 0.18, slot.y + slot.h * 0.28, slot.w * 0.42, slot.h * 0.5);
  ctx.fillStyle = "rgba(255,244,220,.75)";
  ctx.beginPath();
  ctx.arc(slot.x + slot.w * 0.72, slot.y + slot.h * 0.26, Math.min(slot.w, slot.h) * 0.07, 0, Math.PI * 2);
  ctx.fill();
}

export function motionShift(motion: Template["motion"], u: number, speed: Speed, sceneIndex: number, slotIndex: number) {
  const amp = speed === "slow" ? 0.55 : speed === "fast" ? 1.5 : speed === "mixed" ? (sceneIndex % 2 ? 1.45 : 0.6) : 1;
  const uu = clamp(u, 0, 1);
  switch (motion) {
    case "slow-push":
      return { scale: 1 + 0.1 * amp * uu, x: 0, y: 0 };
    case "slow-pull":
      return { scale: 1 + 0.12 * amp * (1 - uu), x: 0, y: 0 };
    case "pan-left":
      return { scale: 1 + 0.16 * amp, x: 0.14 * amp * (0.5 - uu), y: 0 };
    case "pan-right":
      return { scale: 1 + 0.16 * amp, x: 0.14 * amp * (uu - 0.5), y: 0 };
    case "pan-up":
      return { scale: 1 + 0.14 * amp, x: 0, y: 0.1 * amp * (0.5 - uu) };
    case "reveal":
      return { scale: 1 + 0.08 * amp * uu, x: 0, y: 0.04 * amp * (1 - uu) };
    case "diagonal":
      return { scale: 1 + 0.12 * amp, x: 0.08 * amp * (uu - 0.5), y: 0.06 * amp * (0.5 - uu) };
    case "crop-punch":
      return { scale: 1.04 + 0.26 * amp * (1 - uu), x: 0.04 * Math.sin((uu + slotIndex) * Math.PI), y: 0 };
    case "drift":
      return {
        scale: 1.06,
        x: 0.045 * amp * Math.sin((uu + slotIndex * 0.2) * Math.PI),
        y: 0.03 * amp * Math.cos((uu + slotIndex * 0.2) * Math.PI),
      };
    default:
      return { scale: 1.04, x: 0, y: 0 };
  }
}

function scriptFamily(text: string, chosen: string, role: TextSpec["font"]): string {
  if (/[\u0900-\u097F]/.test(text)) return '"Noto Sans Devanagari", sans-serif';
  if (/[\u0A80-\u0AFF]/.test(text)) return '"Noto Sans Gujarati", sans-serif';
  if (/[\u0B80-\u0BFF]/.test(text)) return '"Noto Sans Tamil", sans-serif';
  if (/[\u0C00-\u0C7F]/.test(text)) return '"Noto Sans Telugu", sans-serif';
  if (/[\u0980-\u09FF]/.test(text)) return '"Noto Sans Bengali", sans-serif';
  if (/[\u0C80-\u0CFF]/.test(text)) return '"Noto Sans Kannada", sans-serif';
  if (/[\u0D00-\u0D7F]/.test(text)) return '"Noto Sans Malayalam", sans-serif';
  if (/[\u0A00-\u0A7F]/.test(text)) return '"Noto Sans Gurmukhi", sans-serif';
  if (chosen && chosen !== "Auto") return `"${chosen}", sans-serif`;
  return role === "display" ? '"Playfair Display", Georgia, serif' : '"DM Sans", sans-serif';
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let current = "";
  const pushWord = (word: string) => {
    if (ctx.measureText(word).width <= maxW) {
      current = word;
      return;
    }
    let chunk = "";
    for (const char of word) {
      const next = chunk + char;
      if (ctx.measureText(next).width <= maxW) chunk = next;
      else {
        if (chunk) lines.push(chunk);
        chunk = char;
      }
    }
    current = chunk;
  };
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (ctx.measureText(trial).width <= maxW) current = trial;
    else {
      if (current) lines.push(current);
      pushWord(word);
    }
  }
  if (current) lines.push(current);
  return lines;
}

function ellipsize(ctx: CanvasRenderingContext2D, line: string, maxW: number): string {
  if (ctx.measureText(line).width <= maxW) return line;
  let value = line;
  while (value.length > 1 && ctx.measureText(`${value}…`).width > maxW) value = value.slice(0, -1);
  return `${value}…`;
}

function fillTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  align: TextSpec["align"],
  tracking: number,
) {
  if (!tracking) {
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    return;
  }
  const chars = [...text];
  const widths = chars.map((char) => ctx.measureText(char).width);
  const total = widths.reduce((sum, width) => sum + width, 0) + tracking * Math.max(0, chars.length - 1);
  let cursor = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  ctx.textAlign = "left";
  chars.forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += (widths[index] ?? 0) + tracking;
  });
}

function resolveText(spec: TextSpec, input: PaintInput, scene: PaintInput["scenes"][number]): string {
  if (spec.role === "title") return reelCopy(input.title);
  if (spec.role === "sub") return reelCopy(spec.text || scene.label, scene.label);
  if (spec.role === "kicker") return reelCopy(spec.text || input.template.category, input.template.category).toUpperCase();
  if (spec.role === "counter") return String(scene.index + 1).padStart(2, "0");
  return reelCopy(spec.text || scene.role, scene.role);
}

function drawText(ctx: CanvasRenderingContext2D, spec: TextSpec, input: PaintInput, scene: PaintInput["scenes"][number], u: number) {
  const raw = reelCopy(resolveText(spec, input, scene));
  if (!raw.trim()) return;
  const placed: TextSpec = spec.rotate
    ? spec
    : {
        ...spec,
        x: spec.align === "center" ? spec.x : spec.align === "right" ? Math.min(spec.x, CANVAS_W - SAFE.right) : Math.max(SAFE.left, spec.x),
        y: clamp(spec.y, SAFE.top, CANVAS_H - SAFE.bottom - 36),
        maxW: Math.min(spec.maxW, CANVAS_W - SAFE.left - SAFE.right),
      };
  if (!placed.rotate) {
    placed.maxH = Math.max(28, Math.min(placed.maxH, CANVAS_H - SAFE.bottom - placed.y));
  }
  if (placed.motion === "rise") placed.y += (1 - u) * 28;
  if (placed.motion === "slide") placed.x += (1 - u) * 36;
  const family = scriptFamily(raw, input.fontFamily, placed.font);
  let size = Math.max(16, Math.round(placed.size * input.fontScale));
  const min = Math.max(16, Math.round(placed.size * 0.42));
  let lines: string[] = [raw];
  for (let guard = 0; guard < 48; guard++) {
    ctx.font = `${placed.italic ? "italic " : ""}${placed.weight} ${size}px ${family}`;
    lines = wrapLines(ctx, raw, placed.maxW);
    const tooMany = lines.length > placed.maxLines;
    const height = Math.max(1, lines.length) * size * 1.16;
    if (!tooMany && height <= placed.maxH) break;
    if (size <= min) {
      const fitCount = Math.max(1, Math.min(placed.maxLines, Math.floor(placed.maxH / (size * 1.16)) || 1));
      lines = lines.slice(0, fitCount);
      const last = lines.length - 1;
      lines[last] = ellipsize(ctx, lines[last] ?? "", placed.maxW);
      break;
    }
    size -= 2;
  }
  ctx.fillStyle = placed.color;
  ctx.textBaseline = "top";
  const lineHeight = size * 1.16;
  const paint = () => {
    lines.forEach((line, index) => fillTracked(ctx, line, placed.rotate ? 0 : placed.x, (placed.rotate ? 0 : placed.y) + index * lineHeight, placed.align, placed.tracking ?? 0));
  };
  if (placed.rotate) {
    ctx.save();
    ctx.translate(placed.x, placed.y);
    ctx.rotate((placed.rotate * Math.PI) / 180);
    ctx.font = `${placed.italic ? "italic " : ""}${placed.weight} ${size}px ${family}`;
    paint();
    ctx.restore();
    return;
  }
  ctx.font = `${placed.italic ? "italic " : ""}${placed.weight} ${size}px ${family}`;
  paint();
}

function drawDeco(ctx: CanvasRenderingContext2D, deco: Deco) {
  if (deco.type === "rect") {
    ctx.fillStyle = deco.fill;
    ctx.fillRect(deco.x, deco.y, deco.w, deco.h);
    return;
  }
  if (deco.type === "shade") {
    const gradient = ctx.createLinearGradient(deco.x, deco.y, deco.x, deco.y + deco.h);
    gradient.addColorStop(0, deco.from);
    gradient.addColorStop(1, deco.to);
    ctx.fillStyle = gradient;
    ctx.fillRect(deco.x, deco.y, deco.w, deco.h);
    return;
  }
  if (deco.type === "letterbox") {
    ctx.fillStyle = deco.color;
    ctx.fillRect(0, 0, CANVAS_W, deco.size);
    ctx.fillRect(0, CANVAS_H - deco.size, CANVAS_W, deco.size);
    return;
  }
  if (deco.type === "vignette") {
    const gradient = ctx.createRadialGradient(540, 860, 180, 540, 960, 980);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(0,0,0,${deco.strength})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    return;
  }
  if (deco.type === "frame") {
    ctx.strokeStyle = deco.color;
    ctx.lineWidth = deco.width;
    ctx.strokeRect(deco.x, deco.y, deco.w, deco.h);
    return;
  }
  if (deco.type === "line") {
    ctx.strokeStyle = deco.color;
    ctx.lineWidth = deco.width;
    ctx.beginPath();
    ctx.moveTo(deco.x1, deco.y1);
    ctx.lineTo(deco.x2, deco.y2);
    ctx.stroke();
    return;
  }
  if (deco.type === "circle") {
    ctx.beginPath();
    ctx.arc(deco.cx, deco.cy, Math.max(1, deco.r), 0, Math.PI * 2);
    if (deco.r > 40) {
      ctx.strokeStyle = deco.color;
      ctx.lineWidth = Math.max(2, deco.width);
      ctx.stroke();
    } else {
      ctx.fillStyle = deco.color;
      ctx.fill();
    }
    return;
  }
  if (deco.type === "sprockets") {
    ctx.fillStyle = "#070707";
    ctx.fillRect(0, 0, 46, CANVAS_H);
    ctx.fillRect(CANVAS_W - 46, 0, 46, CANVAS_H);
    ctx.fillStyle = "#e6e0d6";
    for (let y = 36; y < CANVAS_H - 20; y += 46) {
      ctx.beginPath();
      ctx.arc(23, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(CANVAS_W - 23, y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawSlot(
  ctx: CanvasRenderingContext2D,
  compositionSlot: Slot,
  asset: MediaAsset | undefined,
  input: PaintInput,
  sceneIndex: number,
  u: number,
): { drew: boolean; missing?: string } {
  const shift = motionShift(input.template.motion, u, input.speed, sceneIndex, compositionSlot.asset);
  ctx.save();
  const cx = compositionSlot.x + compositionSlot.w / 2;
  const cy = compositionSlot.y + compositionSlot.h / 2;
  if (compositionSlot.rot) {
    ctx.translate(cx, cy);
    ctx.rotate((compositionSlot.rot * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }
  if (compositionSlot.shadow) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.01)";
    ctx.shadowColor = "rgba(0,0,0,.35)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 14;
    ctx.fillRect(compositionSlot.x, compositionSlot.y, compositionSlot.w, compositionSlot.h);
    ctx.restore();
  }
  if (compositionSlot.polaroid) {
    const padX = 22;
    const padTop = 22;
    const foot = compositionSlot.caption ? 92 : 28;
    ctx.fillStyle = "#fbf8f3";
    roundPath(ctx, compositionSlot.x - padX, compositionSlot.y - padTop, compositionSlot.w + padX * 2, compositionSlot.h + padTop + foot, 3);
    ctx.fill();
  }
  ctx.save();
  clipSlot(ctx, compositionSlot);
  ctx.clip();
  let drew = false;
  let missing: string | undefined;
  if (compositionSlot.mono) ctx.filter = "grayscale(1) contrast(1.06)";
  const bitmap = asset ? input.bitmap(asset) : null;
  if (bitmap) {
    drew = cover(
      ctx,
      bitmap,
      compositionSlot.x,
      compositionSlot.y,
      compositionSlot.w,
      compositionSlot.h,
      (compositionSlot.focusX ?? 0.5) + shift.x,
      (compositionSlot.focusY ?? 0.45) + shift.y,
      (compositionSlot.scale ?? 1) * shift.scale,
    );
    if (!drew) missing = asset?.title;
  } else if (input.demo || asset?.demo) {
    drawPlate(ctx, compositionSlot, compositionSlot.asset + sceneIndex);
    drew = true;
  } else {
    ctx.fillStyle = "#1a1e24";
    ctx.fillRect(compositionSlot.x, compositionSlot.y, compositionSlot.w, compositionSlot.h);
    missing = asset?.title || "Missing media";
    if (!input.strict) {
      ctx.fillStyle = "#d9d3c7";
      ctx.font = '600 28px "DM Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(missing, compositionSlot.x + compositionSlot.w / 2, compositionSlot.y + compositionSlot.h / 2, compositionSlot.w - 24);
      drew = true;
      missing = undefined;
    }
  }
  ctx.filter = "none";
  ctx.restore();
  if (compositionSlot.caption) {
    const caption = reelCopy(input.title);
    if (caption) {
      ctx.fillStyle = "#2a241c";
      ctx.font = 'italic 32px "Playfair Display", Georgia, serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const footY = compositionSlot.y + compositionSlot.h + 16;
      const maxW = compositionSlot.w - 16;
      const line = ellipsize(ctx, caption, maxW);
      ctx.fillText(line, compositionSlot.x + compositionSlot.w / 2, footY, maxW);
    }
  }
  ctx.restore();
  return { drew, missing };
}

function renderComposition(
  ctx: CanvasRenderingContext2D,
  composition: Composition,
  input: PaintInput,
  scene: PaintInput["scenes"][number],
  u: number,
): PaintResult {
  ctx.save();
  ctx.setTransform(ctx.canvas.width / CANVAS_W, 0, 0, ctx.canvas.height / CANVAS_H, 0, 0);
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = composition.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  for (const deco of composition.decos) if (deco.layer === "back") drawDeco(ctx, deco);
  let drewMedia = false;
  let missingTitle: string | undefined;
  composition.slots.forEach((item) => {
    const asset = scene.assets[Math.min(item.asset, Math.max(0, scene.assets.length - 1))];
    const drawn = drawSlot(ctx, item, asset, input, scene.index, u);
    if (drawn.drew) drewMedia = true;
    if (drawn.missing && !missingTitle) missingTitle = drawn.missing;
  });
  for (const deco of composition.decos) if (deco.layer === "front") drawDeco(ctx, deco);
  for (const spec of composition.texts) drawText(ctx, spec, input, scene, u);
  if (input.demo) {
    ctx.fillStyle = "rgba(0,0,0,.62)";
    roundPath(ctx, 36, 36, 148, 46, 8);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = '700 24px "DM Sans", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("DEMO", 62, 48);
  }
  ctx.restore();
  return { sceneIndex: scene.index, drewMedia, missingTitle };
}

let bufferA: HTMLCanvasElement | null = null;
let bufferB: HTMLCanvasElement | null = null;

function scratch(which: "a" | "b"): HTMLCanvasElement {
  const existing = which === "a" ? bufferA : bufferB;
  if (existing) return existing;
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  if (which === "a") bufferA = canvas;
  else bufferB = canvas;
  return canvas;
}

function composite(ctx: CanvasRenderingContext2D, from: HTMLCanvasElement, to: HTMLCanvasElement, blend: number, kind: Template["transition"]) {
  const p = clamp(blend, 0, 1);
  const paint = (source: HTMLCanvasElement, alpha = 1, dx = 0) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(source, dx, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  };
  if (kind === "hard") {
    paint(p < 0.5 ? from : to);
    return;
  }
  if (kind === "slide") {
    paint(from);
    paint(to, 1, (1 - p) * CANVAS_W);
    return;
  }
  if (kind === "wipe" || kind === "reveal") {
    paint(from);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_W * p, CANVAS_H);
    ctx.clip();
    paint(to);
    ctx.restore();
    return;
  }
  if (kind === "mask") {
    paint(from);
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 960, p * 1300, 0, Math.PI * 2);
    ctx.clip();
    paint(to);
    ctx.restore();
    return;
  }
  if (kind === "film-cut") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    paint(p > 0.45 ? to : from, p > 0.45 ? (p - 0.45) / 0.55 : 1 - p / 0.45);
    return;
  }
  if (kind === "flash") {
    paint(p < 0.5 ? from : to);
    const flash = p < 0.5 ? p * 2 : (1 - p) * 2;
    ctx.fillStyle = `rgba(255,248,236,${flash * 0.82})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    return;
  }
  paint(from);
  paint(to, p);
}

export function paintFrame(ctx: CanvasRenderingContext2D, input: PaintInput): PaintResult {
  if (!input.scenes.length) {
    ctx.setTransform(ctx.canvas.width / CANVAS_W, 0, 0, ctx.canvas.height / CANVAS_H, 0, 0);
    ctx.fillStyle = "#0b0d10";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "#e8e1d5";
    ctx.font = '600 42px "DM Sans", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Select media, then build", CANVAS_W / 2, CANVAS_H / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return { sceneIndex: 0, drewMedia: false };
  }
  const durations = sceneDurations(input.duration, input.scenes.length);
  const spot = locate(input.time, durations, (index) => transitionSeconds(input.template.transition, input.speed, index));
  const scene = input.scenes[spot.index] ?? input.scenes[0]!;
  const drawOne = (target: CanvasRenderingContext2D, index: number, u: number) => {
    const current = input.scenes[index] ?? scene;
    return renderComposition(target, compose(input.template, current), input, current, u);
  };
  if (spot.blend > 0.001 && input.scenes.length > 1 && typeof document !== "undefined") {
    const primary = drawOne(scratch("a").getContext("2d")!, spot.index, spot.u);
    const incoming = drawOne(scratch("b").getContext("2d")!, spot.next, 0.04);
    ctx.setTransform(ctx.canvas.width / CANVAS_W, 0, 0, ctx.canvas.height / CANVAS_H, 0, 0);
    composite(ctx, scratch("a"), scratch("b"), spot.blend, input.template.transition);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return { sceneIndex: spot.index, drewMedia: primary.drewMedia && incoming.drewMedia, missingTitle: primary.missingTitle || incoming.missingTitle };
  }
  const result = drawOne(ctx, spot.index, spot.u);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return result;
}

export function frameHasContent(ctx: CanvasRenderingContext2D): boolean {
  try {
    const { width, height, data } = (() => {
      const image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      return { width: ctx.canvas.width, height: ctx.canvas.height, data: image.data };
    })();
    const points: Array<[number, number]> = [
      [0.5, 0.45],
      [0.2, 0.3],
      [0.8, 0.3],
      [0.5, 0.7],
      [0.3, 0.8],
      [0.75, 0.62],
    ];
    let min = 255;
    let max = 0;
    for (const [fx, fy] of points) {
      const x = Math.min(width - 1, Math.max(0, Math.floor(fx * width)));
      const y = Math.min(height - 1, Math.max(0, Math.floor(fy * height)));
      const index = (y * width + x) * 4;
      const lum = (data[index] ?? 0) * 0.3 + (data[index + 1] ?? 0) * 0.59 + (data[index + 2] ?? 0) * 0.11;
      min = Math.min(min, lum);
      max = Math.max(max, lum);
    }
    return max - min > 6 || max > 18;
  } catch {
    return false;
  }
}
