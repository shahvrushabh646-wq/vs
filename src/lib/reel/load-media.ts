import type { MediaAsset, Speed } from "./types";

export type LoadedMedia = {
  asset: MediaAsset;
  image?: HTMLImageElement;
  video?: HTMLVideoElement;
};

export function proxied(url: string): string {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/api/media-proxy?")) return url;
  return `/api/media-proxy?url=${encodeURIComponent(url)}`;
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

function loadImage(url: string, ms: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    const timer = window.setTimeout(() => {
      image.src = "";
      reject(new Error(`timed out after ${Math.round(ms / 1000)} seconds`));
    }, ms);
    image.onload = () => {
      window.clearTimeout(timer);
      if (image.naturalWidth < 2 || image.naturalHeight < 2) {
        reject(new Error("decoded without dimensions"));
        return;
      }
      resolve(image);
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("could not be decoded"));
    };
    image.src = url;
  });
}

function seek(video: HTMLVideoElement, time: number): Promise<void> {
  const target = Math.max(0, Math.min(time, Math.max(0, (video.duration || time) - 0.04)));
  if (Math.abs(video.currentTime - target) < 0.05 && video.readyState >= 2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      video.removeEventListener("seeked", onSeek);
      reject(new Error("seek timed out"));
    }, 8000);
    const onSeek = () => {
      window.clearTimeout(timer);
      video.removeEventListener("seeked", onSeek);
      resolve();
    };
    video.addEventListener("seeked", onSeek);
    try {
      video.currentTime = target;
    } catch (error) {
      window.clearTimeout(timer);
      video.removeEventListener("seeked", onSeek);
      reject(error instanceof Error ? error : new Error("seek failed"));
    }
  });
}

function loadVideo(url: string, ms: number): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    let settled = false;
    const finish = (error?: Error, value?: HTMLVideoElement) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      video.onloadeddata = null;
      video.onerror = null;
      if (error || !value) reject(error ?? new Error("could not be decoded"));
      else resolve(value);
    };
    const timer = window.setTimeout(() => finish(new Error(`timed out after ${Math.round(ms / 1000)} seconds`)), ms);
    let armed = false;
    const ready = () => {
      if (armed || video.videoWidth < 2 || !Number.isFinite(video.duration) || video.duration <= 0) return;
      armed = true;
      const opener = Math.min(0.12, Math.max(0, video.duration * 0.02));
      void seek(video, opener).then(
        () => finish(undefined, video),
        () => finish(undefined, video),
      );
    };
    video.onloadeddata = ready;
    video.onloadedmetadata = ready;
    video.onerror = () => finish(new Error("could not be decoded"));
    video.src = url;
    video.load();
  });
}

export async function loadAsset(asset: MediaAsset): Promise<LoadedMedia> {
  if (asset.demo) return { asset };
  const candidates = unique([asset.playUrl, asset.thumb, asset.originalUrl ?? "", asset.url]);
  if (!candidates.length) throw new Error("has no playable file");
  let last = "could not be loaded";
  for (const candidate of candidates.slice(0, 3)) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (asset.kind === "video") return { asset, video: await loadVideo(proxied(candidate), 18000) };
        return { asset, image: await loadImage(proxied(candidate), 12000) };
      } catch (error) {
        last = error instanceof Error ? error.message : "could not be loaded";
      }
    }
  }
  const timedOut = /timed out/i.test(last);
  const reason = timedOut
    ? `${asset.source} ${asset.kind} timed out after ${asset.kind === "video" ? 18 : 12} seconds.`
    : `${asset.source} ${asset.kind} failed to load (${last}).`;
  throw new Error(reason);
}

export async function loadThumb(asset: MediaAsset): Promise<HTMLImageElement> {
  const src = asset.thumb || asset.playUrl || asset.url;
  if (!src) throw new Error("no thumbnail");
  if (asset.local && asset.kind === "image") return loadImage(src, 8000);
  return loadImage(proxied(src), 12000);
}

export function videoTimeFor(video: HTMLVideoElement, sceneIndex: number, u: number, sceneDur: number, speed: Speed): number {
  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0.1) return 0;
  const rate = speed === "fast" ? 1.15 : speed === "slow" ? 0.85 : 1;
  const span = Math.min(duration * 0.92, Math.max(0.45, sceneDur * rate));
  const maxStart = Math.max(0, duration - span - 0.05);
  const start = maxStart * ((sceneIndex * 0.37) % 1);
  return Math.min(duration - 0.04, start + Math.max(0, Math.min(1, u)) * span);
}

export async function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  if (video.readyState < 1) throw new Error("video metadata is not loaded");
  await seek(video, time);
}

export async function ensureFonts(family: string): Promise<void> {
  const families = [family, "Playfair Display", "DM Sans", "Noto Sans Devanagari", "Noto Sans Gujarati", "Noto Sans Tamil"];
  await Promise.all(
    families.filter(Boolean).map(async (name) => {
      try {
        await document.fonts.load(`700 64px "${name}"`);
      } catch {
        /* missing families fall back at draw time */
      }
    }),
  );
  await document.fonts.ready;
}

export function releaseVideo(video: HTMLVideoElement | undefined) {
  if (!video) return;
  try {
    video.pause();
    video.removeAttribute("src");
    video.load();
  } catch {
    /* already detached */
  }
}
