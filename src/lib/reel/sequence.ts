import type { MediaAsset, Scene, Speed, Template, TransitionId } from "./types";

const MULTI: Partial<Record<Template["layout"], number>> = {
  journey: 2,
  polaroid: 2,
  scrapbook: 3,
  grid: 4,
  dgrid: 3,
  wall: 4,
  mframe: 3,
};

export function desiredSlots(template: Template): number {
  return MULTI[template.layout] ?? 1;
}

export function demoAssets(count: number): MediaAsset[] {
  return Array.from({ length: Math.max(1, count) }, (_, index) => ({
    id: `demo-${index + 1}`,
    title: `Demo ${index + 1}`,
    source: "Demo",
    kind: "image" as const,
    url: "",
    thumb: "",
    playUrl: "",
    demo: true,
  }));
}

export function durationFor(template: Template, speed: Speed): number {
  const mult = speed === "slow" ? 1.2 : speed === "fast" ? 0.75 : 1;
  return Math.max(8, Math.round(template.duration * mult));
}

export function buildScenes(template: Template, selected: MediaAsset[]): Scene[] {
  if (!selected.length) return [];
  const want = desiredSlots(template);
  const sceneCount = Math.max(template.beats.length, selected.length);
  const scenes: Scene[] = [];
  for (let index = 0; index < sceneCount; index++) {
    const beat = template.beats[index % template.beats.length]!;
    const count = Math.min(want, selected.length);
    const assets: MediaAsset[] = [];
    for (let k = 0; k < count; k++) {
      const asset = selected[(index + k) % selected.length];
      if (asset) assets.push(asset);
    }
    scenes.push({ index, role: beat.role, label: beat.label, assets });
  }
  return scenes;
}

export function coversSelection(scenes: Scene[], selected: MediaAsset[]): boolean {
  const seen = new Set<string>();
  for (const scene of scenes) for (const asset of scene.assets) seen.add(asset.id);
  return selected.every((asset) => seen.has(asset.id));
}

export function sceneDurations(total: number, count: number): number[] {
  if (count <= 0) return [];
  const each = Math.max(0.4, total) / count;
  return Array.from({ length: count }, () => each);
}

export function transitionSeconds(id: TransitionId, speed: Speed, sceneIndex: number): number {
  const base =
    id === "hard" ? 0.07 : id === "flash" || id === "film-cut" ? 0.2 : id === "fade" || id === "crossfade" ? 0.5 : 0.36;
  const mult = speed === "slow" ? 1.3 : speed === "fast" ? 0.55 : speed === "mixed" ? (sceneIndex % 2 === 0 ? 1.2 : 0.62) : 1;
  return Math.min(1.05, base * mult);
}

export function locate(
  time: number,
  durations: number[],
  transFor: (sceneIndex: number) => number,
): { index: number; local: number; u: number; blend: number; next: number; duration: number } {
  const total = durations.reduce((sum, value) => sum + value, 0);
  const t = Math.max(0, Math.min(time, Math.max(0, total - 0.0001)));
  let acc = 0;
  for (let i = 0; i < durations.length; i++) {
    const d = durations[i] ?? 0;
    if (t < acc + d || i === durations.length - 1) {
      const local = Math.min(d, Math.max(0, t - acc));
      const u = d <= 0 ? 1 : local / d;
      const remain = d - local;
      const trans = i < durations.length - 1 ? Math.min(transFor(i), d * 0.46) : 0;
      const blend = trans > 0 && remain < trans ? 1 - remain / trans : 0;
      return { index: i, local, u, blend, next: Math.min(durations.length - 1, i + 1), duration: d };
    }
    acc += d;
  }
  const last = Math.max(0, durations.length - 1);
  return { index: last, local: 0, u: 1, blend: 0, next: last, duration: durations[last] ?? 0 };
}
