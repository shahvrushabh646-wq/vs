export type MediaKind = "image" | "video";

export type MediaAsset = {
  id: string;
  title: string;
  source: string;
  kind: MediaKind;
  url: string;
  thumb: string;
  playUrl: string;
  originalUrl?: string;
  width?: number;
  height?: number;
  mime?: string;
  license?: string;
  licenseUrl?: string;
  author?: string;
  pageUrl?: string;
  local?: boolean;
  demo?: boolean;
};

export type Speed = "slow" | "medium" | "fast" | "mixed";

export type PaletteId =
  | "gold"
  | "ivory"
  | "brass"
  | "teal"
  | "vermilion"
  | "charcoal"
  | "sandal"
  | "indigo"
  | "marigold"
  | "slate"
  | "rose"
  | "forest"
  | "cream"
  | "night"
  | "copper";

export type Category =
  | "Cinematic"
  | "Editorial"
  | "Magazine"
  | "Memory"
  | "Collage"
  | "Devotional"
  | "Festival"
  | "Documentary"
  | "Heritage"
  | "Minimal"
  | "Special";

export type MotionId =
  | "slow-push"
  | "slow-pull"
  | "pan-left"
  | "pan-right"
  | "pan-up"
  | "reveal"
  | "diagonal"
  | "crop-punch"
  | "drift";

export type TransitionId =
  | "fade"
  | "crossfade"
  | "slide"
  | "wipe"
  | "film-cut"
  | "flash"
  | "reveal"
  | "mask"
  | "hard";

export type LayoutId =
  | "dawn"
  | "focus"
  | "journey"
  | "meaning"
  | "split"
  | "column"
  | "eframe"
  | "estory"
  | "cover"
  | "feature"
  | "mbold"
  | "polaroid"
  | "diary"
  | "scrapbook"
  | "grid"
  | "dgrid"
  | "wall"
  | "mframe"
  | "sacred"
  | "temple"
  | "devotional"
  | "energy"
  | "burst"
  | "crowd"
  | "doc"
  | "timeline"
  | "journal"
  | "hframe"
  | "minimal"
  | "quote"
  | "mono"
  | "kinetic"
  | "dcrop"
  | "news"
  | "vlabel"
  | "sacredoc"
  | "cards"
  | "finale";

export type Beat = { role: string; label: string };

export type Template = {
  id: string;
  name: string;
  category: Category;
  /** Canva-style design type, e.g. "Instagram Stories". Shown as the shelf heading. */
  format: string;
  /** Shelf this card belongs to. */
  sectionId: string;
  description: string;
  layout: LayoutId;
  motion: MotionId;
  transition: TransitionId;
  duration: number;
  beats: Beat[];
  palette: PaletteId;
  variant: number;
};

export type Scene = {
  index: number;
  role: string;
  label: string;
  assets: MediaAsset[];
};

export type SearchPayload = {
  results: MediaAsset[];
  nextOffset: number | null;
  source: string;
  counts: { photos: number; videos: number };
  errors: string[];
  message?: string;
  error?: string;
};

export const CANVAS_W = 1080;
export const CANVAS_H = 1920;

export const SAFE = { top: 220, bottom: 340, left: 72, right: 72 };

export function qcFail(parts: {
  scene?: number;
  template?: string;
  asset?: string;
  reason: string;
  fix: string;
}): string {
  const lines = ["QC FAILED", ""];
  if (parts.scene) lines.push(`Scene: ${parts.scene}`);
  if (parts.template) lines.push(`Template: ${parts.template}`);
  if (parts.asset) lines.push(`Asset: ${parts.asset}`);
  lines.push("", `Reason: ${parts.reason}`, "", `Fix: ${parts.fix}`);
  return lines.join("\n");
}
