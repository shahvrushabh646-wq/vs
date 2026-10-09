import { useEffect, useMemo, useRef, useState } from "react";
import { Clapperboard, Images, LayoutTemplate, Music, Type } from "lucide-react";
import type { PaintInput } from "@/lib/reel/engine";
import { frameHasContent, paintFrame } from "@/lib/reel/engine";
import { ensureFonts, loadAsset, loadThumb, proxied, releaseVideo, seekVideo, videoTimeFor, type LoadedMedia } from "@/lib/reel/load-media";
import { buildScenes, coversSelection, demoAssets, desiredSlots, durationFor, locate, sceneDurations, transitionSeconds } from "@/lib/reel/sequence";
import { getTemplate, sectionsFor, SECTIONS, TEMPLATE_TABS, templatesIn, TEMPLATES, type TemplateTabId } from "@/lib/reel/templates";
import type { MediaAsset, Scene, SearchPayload, Speed, Template } from "@/lib/reel/types";
import { qcFail } from "@/lib/reel/types";

type Workspace = "media" | "templates" | "music" | "type" | "preview";
type Phase = "idle" | "building" | "ready" | "playing" | "failed";
type Track = {
  id: string;
  name: string;
  artist_name: string;
  duration: number;
  audio: string | null;
  source: string;
  landing?: string;
  thumbnail?: string;
  local?: boolean;
};

const FONTS = [
  "Auto",
  "Playfair Display",
  "DM Sans",
  "Noto Sans",
  "Noto Sans Devanagari",
  "Noto Sans Gujarati",
  "Noto Sans Tamil",
  "Noto Sans Telugu",
  "Noto Sans Bengali",
  "Noto Sans Kannada",
  "Noto Sans Malayalam",
  "Noto Sans Gurmukhi",
];

const LANGS: Record<string, string> = {
  English: "A living tradition",
  Hindi: "जय श्री महाकाल",
  Gujarati: "જય શ્રી મહાકાલ",
  Marathi: "जय श्री महाकाल",
  Sanskrit: "ॐ नमः शिवाय",
  Tamil: "ஓம் நமசிவாய",
  Telugu: "ఓం నమః శివాయ",
  Bengali: "জয় শ্রী মহাকাল",
  Kannada: "ಓಂ ನಮಃ ಶಿವಾಯ",
  Malayalam: "ഓം നമഃ ശിവായ",
  Punjabi: "ਜੈ ਸ਼੍ਰੀ ਮਹਾਕਾਲ",
};

const NAV: Array<{ id: Workspace | "professional"; label: string; icon: typeof Images }> = [
  { id: "media", label: "Media", icon: Images },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "professional", label: "Professional", icon: LayoutTemplate },
  { id: "music", label: "Music", icon: Music },
  { id: "type", label: "Type", icon: Type },
  { id: "preview", label: "Preview", icon: Clapperboard },
];

function TemplateCard({
  template,
  active,
  assets,
  title,
  fontFamily,
  fontScale,
  speed,
  duration,
  tick,
  bitmap,
  onUse,
}: {
  template: Template;
  active: boolean;
  assets: MediaAsset[];
  title: string;
  fontFamily: string;
  fontScale: number;
  speed: Speed;
  duration: number;
  tick: number;
  bitmap: (asset: MediaAsset) => CanvasImageSource | null;
  onUse: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = cardRef.current;
    if (!node || seen) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setSeen(true);
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [seen]);
  useEffect(() => {
    if (!seen) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = 180;
    canvas.height = 320;
    const source = assets.length ? assets : demoAssets(desiredSlots(template));
    const scenes = buildScenes(template, source);
    try {
      paintFrame(ctx, {
        template,
        scenes,
        time: ((duration || template.duration) / Math.max(1, scenes.length)) * 0.42,
        duration: duration || template.duration,
        speed,
        title,
        fontFamily,
        fontScale,
        demo: assets.length === 0,
        strict: false,
        bitmap,
      });
    } catch {
      /* a single card must not take down the gallery */
    }
  }, [seen, template, assets, title, fontFamily, fontScale, speed, duration, tick, bitmap]);
  return (
    <article ref={cardRef} className={active ? "tcard chosen" : "tcard"}>
      <button className="thumbHit" type="button" onClick={onUse} aria-label={`Customize ${template.name}`}>
        <canvas ref={ref} className="thumb" aria-hidden />
        <span className="thumbAction">{active ? "Selected" : "Customize"}</span>
      </button>
      <h3>{template.name}</h3>
      <p>{template.format} · 1080×1920</p>
    </article>
  );
}

export function Studio() {
  const [workspace, setWorkspace] = useState<Workspace>("templates");
  const [query, setQuery] = useState("Navratri");
  const [status, setStatus] = useState("Search a festival, deity, place, or tradition.");
  const [statusBad, setStatusBad] = useState(false);
  const [results, setResults] = useState<MediaAsset[]>([]);
  const [selected, setSelected] = useState<MediaAsset[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const [mediaTab, setMediaTab] = useState<"all" | "image" | "video">("all");
  const [templateId, setTemplateId] = useState(TEMPLATES.find((item) => item.sectionId === "reel-cinematic")?.id ?? TEMPLATES[0]!.id);
  const [templateTab, setTemplateTab] = useState<TemplateTabId>("professional");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState("");
  const [speed, setSpeed] = useState<Speed>("medium");
  const [duration, setDuration] = useState(TEMPLATES.find((item) => item.sectionId === "reel-cinematic")?.duration ?? TEMPLATES[0]!.duration);
  const [title, setTitle] = useState("");
  const [fontFamily, setFontFamily] = useState("Auto");
  const [fontScale, setFontScale] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState("");
  const [qc, setQc] = useState("Select media and a template, then Build Preview.");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [thumbTick, setThumbTick] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);
  const [templatePage, setTemplatePage] = useState(24);
  const [musicQuery, setMusicQuery] = useState("indian classical");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [musicStatus, setMusicStatus] = useState("Search licensed catalogs, or import a file you have rights to.");
  const [music, setMusic] = useState<Track | null>(null);
  const [musicStart, setMusicStart] = useState(0);
  const [musicEnd, setMusicEnd] = useState(15);

  const template = getTemplate(templateId) ?? TEMPLATES[0]!;
  const selectedRef = useRef(selected);
  const templateRef = useRef(template);
  const speedRef = useRef(speed);
  const durationRef = useRef(duration);
  const titleRef = useRef(title);
  const fontRef = useRef(fontFamily);
  const scaleRef = useRef(fontScale);
  const musicRef = useRef(music);
  const trimRef = useRef({ start: musicStart, end: musicEnd });
  const loadedRef = useRef(new Map<string, LoadedMedia>());
  const thumbsRef = useRef(new Map<string, HTMLImageElement>());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runId = useRef(0);
  const playToken = useRef(0);
  const playingRef = useRef(false);
  const readyRef = useRef(false);
  const demoRef = useRef(false);
  const buildingRef = useRef(false);
  const rafRef = useRef(0);
  const scenesRef = useRef<Scene[]>([]);
  const sceneMark = useRef(-1);
  const searchGen = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bitmapRef = useRef<(asset: MediaAsset) => CanvasImageSource | null>(() => null);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  useEffect(() => {
    templateRef.current = template;
  }, [template]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);
  useEffect(() => {
    titleRef.current = title;
  }, [title]);
  useEffect(() => {
    fontRef.current = fontFamily;
  }, [fontFamily]);
  useEffect(() => {
    scaleRef.current = fontScale;
  }, [fontScale]);
  useEffect(() => {
    musicRef.current = music;
    trimRef.current = { start: musicStart, end: musicEnd };
  }, [music, musicStart, musicEnd]);

  useEffect(() => {
    setTemplatePage(24);
  }, [templateTab, openSection, templateQuery]);

  useEffect(() => {
    if (workspace !== "preview" || readyRef.current || playingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = 1080;
    canvas.height = 1920;
    paintFrame(ctx, paintInput(0, false));
  }, [workspace]);

  const bitmap = useMemo(() => {
    const fn = (asset: MediaAsset) => {
      if (asset.demo) return null;
      const loaded = loadedRef.current.get(asset.id);
      if (loaded?.image) return loaded.image;
      if (loaded?.video && loaded.video.readyState >= 2) return loaded.video;
      return thumbsRef.current.get(asset.id) ?? null;
    };
    bitmapRef.current = fn;
    return fn;
  }, [thumbTick]);

  useEffect(() => {
    let cancel = false;
    const pending = selected.filter((asset) => !asset.demo && !thumbsRef.current.has(asset.id) && (asset.thumb || asset.playUrl));
    if (!pending.length) return;
    void (async () => {
      for (const asset of pending) {
        try {
          const image = await loadThumb(asset);
          if (cancel) return;
          thumbsRef.current.set(asset.id, image);
          setThumbTick((value) => value + 1);
        } catch {
          /* the real build reports the exact asset */
        }
      }
    })();
    return () => {
      cancel = true;
    };
  }, [selected]);

  const visible = results.filter((asset) => mediaTab === "all" || asset.kind === mediaTab);
  const queryText = templateQuery.trim().toLowerCase();
  const searchHits = queryText
    ? TEMPLATES.filter((item) => `${item.name} ${item.format} ${item.category} ${item.description}`.toLowerCase().includes(queryText))
    : [];
  const shelves = sectionsFor(templateTab);
  const focusSection = SECTIONS.find((section) => section.id === openSection) ?? null;
  const focusTemplates = focusSection ? templatesIn(focusSection.id) : [];
  const visibleSearch = searchHits.slice(0, templatePage);
  const visibleFocus = focusTemplates.slice(0, templatePage);
  const plan = useMemo(() => (selected.length ? buildScenes(template, selected) : []), [selected, template]);

  function invalidateReady(message: string) {
    playToken.current += 1;
    playingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    readyRef.current = false;
    demoRef.current = false;
    setDownloadReady(false);
    for (const item of loadedRef.current.values()) item.video?.pause();
    setPhase("idle");
    setProgress("");
    setQc(message);
  }

  function paintInput(time: number, demo: boolean): PaintInput {
    return {
      template: templateRef.current,
      scenes: scenesRef.current,
      time,
      duration: durationRef.current,
      speed: speedRef.current,
      title: titleRef.current,
      fontFamily: fontRef.current,
      fontScale: scaleRef.current,
      demo,
      strict: !demo,
      bitmap: (asset) => bitmapRef.current(asset),
    };
  }

  async function syncVideos(time: number) {
    const scenesNow = scenesRef.current;
    const durations = sceneDurations(durationRef.current, scenesNow.length);
    const spot = locate(time, durations, (index) => transitionSeconds(templateRef.current.transition, speedRef.current, index));
    const scene = scenesNow[spot.index];
    if (!scene) return;
    const active = new Set(scene.assets.filter((asset) => asset.kind === "video").map((asset) => asset.id));
    const entered = sceneMark.current !== spot.index;
    if (entered) sceneMark.current = spot.index;
    for (const [id, item] of loadedRef.current) {
      if (!item.video) continue;
      if (!active.has(id)) {
        item.video.pause();
        continue;
      }
      if (entered) {
        const at = videoTimeFor(item.video, spot.index, 0, spot.duration, speedRef.current);
        await seekVideo(item.video, at);
      }
      if (item.video.paused) {
        try {
          await item.video.play();
        } catch {
          throw new Error(`${item.asset.title} could not start playback.`);
        }
      }
    }
  }

  function stopAudio() {
    audioRef.current?.pause();
  }

  function startAudio() {
    const track = musicRef.current;
    if (!track?.audio) return;
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.crossOrigin = "anonymous";
    if (audio.dataset.track !== track.id) {
      audio.src = track.audio;
      audio.dataset.track = track.id;
    }
    const start = Math.max(0, trimRef.current.start || 0);
    const end = trimRef.current.end || 0;
    audio.currentTime = start;
    audio.ontimeupdate = () => {
      if (end > start && audio.currentTime >= end) audio.pause();
    };
    void audio.play().catch(() => setMusicStatus("Music preview could not start. The picture reel can still play."));
  }

  function startLoop(token: number, demo: boolean) {
    playingRef.current = true;
    setPhase("playing");
    const started = performance.now();
    sceneMark.current = -1;
    startAudio();
    const tick = () => {
      if (playToken.current !== token || !playingRef.current) return;
      const elapsed = ((performance.now() - started) / 1000) % Math.max(1, durationRef.current);
      void (async () => {
        if (playToken.current !== token || !playingRef.current) return;
        try {
          if (!demo) await syncVideos(elapsed);
        } catch (error) {
          playingRef.current = false;
          readyRef.current = false;
          setPhase("failed");
          setQc(
            qcFail({
              template: templateRef.current.name,
              reason: error instanceof Error ? error.message : "Video playback failed.",
              fix: "Re-select the video or pick a photo.",
            }),
          );
          return;
        }
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx || playToken.current !== token) return;
        paintFrame(ctx, paintInput(elapsed, demo));
        if (playingRef.current && playToken.current === token) rafRef.current = requestAnimationFrame(tick);
      })();
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  async function runBuild(options: { autoplay: boolean; demo: boolean; templateId?: string }) {
    if (buildingRef.current) return false;
    const chosen = getTemplate(options.templateId || templateRef.current.id) ?? templateRef.current;
    templateRef.current = chosen;
    if (options.templateId) setTemplateId(chosen.id);
    const demo = options.demo;
    const assets = demo ? demoAssets(desiredSlots(chosen)) : selectedRef.current.slice();
    if (!demo && !assets.length) {
      setPhase("failed");
      setQc(qcFail({ template: chosen.name, reason: "No media selected.", fix: "Select at least one photo or video." }));
      setWorkspace("media");
      return false;
    }
    const run = ++runId.current;
    const alive = () => runId.current === run;
    buildingRef.current = true;
    playToken.current += 1;
    playingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    stopAudio();
    readyRef.current = false;
    demoRef.current = demo;
    setDownloadReady(false);
    setPhase("building");
    setProgress("Checking selected media…");
    setQc(`${chosen.name}\nChecking selected media…`);
    try {
      for (const asset of assets) {
        if (demo) continue;
        if (!asset.playUrl && !asset.url) {
          throw new Error(qcFail({ template: chosen.name, asset: asset.title, reason: "Selected asset has no playable file.", fix: "Re-select the asset." }));
        }
      }
      const nextScenes = buildScenes(chosen, assets);
      if (!nextScenes.length) {
        throw new Error(qcFail({ template: chosen.name, reason: "Selected media could not create scenes.", fix: "Select a photo or video and try again." }));
      }
      const allowed = new Set(assets.map((asset) => asset.id));
      nextScenes.forEach((scene, index) => {
        if (!scene.assets.length) {
          throw new Error(qcFail({ scene: index + 1, template: chosen.name, reason: "Scene has no selected asset.", fix: "Re-select media." }));
        }
        for (const asset of scene.assets) {
          if (!allowed.has(asset.id)) {
            throw new Error(
              qcFail({
                scene: index + 1,
                template: chosen.name,
                asset: asset.title,
                reason: "Scene referenced media that was not selected.",
                fix: "Build again. Nothing is substituted automatically.",
              }),
            );
          }
        }
      });
      if (!demo && !coversSelection(nextScenes, assets)) {
        throw new Error(qcFail({ template: chosen.name, reason: "Not every selected asset was placed in the reel.", fix: "Build again." }));
      }
      if (!alive()) return false;
      if (!demo) {
        const keep = new Set(assets.map((asset) => asset.id));
        for (const [id, item] of loadedRef.current) {
          if (!keep.has(id)) {
            releaseVideo(item.video);
            loadedRef.current.delete(id);
          }
        }
        for (let index = 0; index < assets.length; index++) {
          const asset = assets[index]!;
          setProgress(`Loading assets… ${index + 1}/${assets.length}`);
          if (!loadedRef.current.has(asset.id)) {
            try {
              const loaded = await loadAsset(asset);
              if (!alive()) {
                releaseVideo(loaded.video);
                return false;
              }
              loadedRef.current.set(asset.id, loaded);
              if (loaded.image) {
                thumbsRef.current.set(asset.id, loaded.image);
                setThumbTick((value) => value + 1);
              }
            } catch (error) {
              const scene = nextScenes.find((item) => item.assets.some((candidate) => candidate.id === asset.id));
              throw new Error(
                qcFail({
                  scene: scene ? scene.index + 1 : undefined,
                  template: chosen.name,
                  asset: asset.title,
                  reason: error instanceof Error ? error.message : "Media failed to load.",
                  fix: "Re-select the asset.",
                }),
              );
            }
          }
        }
      }
      if (!alive()) return false;
      setProgress("Preparing template…");
      await ensureFonts(fontRef.current === "Auto" ? "Playfair Display" : fontRef.current);
      if (!alive()) return false;
      scenesRef.current = nextScenes;
      setScenes(nextScenes);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) throw new Error(qcFail({ template: chosen.name, reason: "Preview canvas is not available.", fix: "Open Preview and build again." }));
      canvas.width = 1080;
      canvas.height = 1920;
      setProgress("Rendering first frame…");
      sceneMark.current = -1;
      if (!demo) await syncVideos(0);
      if (!alive()) return false;
      const painted = paintFrame(ctx, { ...paintInput(0.05, demo), template: chosen, scenes: nextScenes });
      if (painted.missingTitle || !painted.drewMedia) {
        throw new Error(
          qcFail({
            scene: painted.sceneIndex + 1,
            template: chosen.name,
            asset: painted.missingTitle,
            reason: "First frame did not draw the selected media.",
            fix: "Re-select the asset.",
          }),
        );
      }
      if (!frameHasContent(ctx)) {
        throw new Error(qcFail({ template: chosen.name, reason: "First frame rendered blank.", fix: "Re-select the media and build again." }));
      }
      if (!alive()) return false;
      setProgress("Running QC…");
      readyRef.current = true;
      demoRef.current = demo;
      const photos = assets.filter((asset) => asset.kind === "image").length;
      const videos = assets.filter((asset) => asset.kind === "video").length;
      setQc(
        [
          "READY",
          "",
          `Template: ${chosen.name}`,
          `Scenes: ${nextScenes.length}`,
          `Canvas: 1080×1920`,
          demo ? "Media: labeled demo plates" : `Media: ${photos} photo${photos === 1 ? "" : "s"}, ${videos} video${videos === 1 ? "" : "s"}`,
          "First frame: rendered",
          "Playback: ready",
        ].join("\n"),
      );
      setProgress("Ready");
      setPhase("ready");
      setDownloadReady(!demo);
      if (options.autoplay) startLoop(++playToken.current, demo);
      return true;
    } catch (error) {
      if (!alive()) return false;
      readyRef.current = false;
      setDownloadReady(false);
      setPhase("failed");
      setProgress("");
      setQc(error instanceof Error ? error.message : qcFail({ reason: "Build failed.", fix: "Try again." }));
      return false;
    } finally {
      if (alive()) buildingRef.current = false;
    }
  }

  async function onSearch(offset = 0) {
    const q = query.trim();
    if (!q) return;
    const gen = ++searchGen.current;
    setSearching(true);
    setStatusBad(false);
    setStatus(offset ? "Loading more from Wikimedia Commons…" : "Searching Wikimedia Commons…");
    try {
      const response = await fetch(`/api/media-search?q=${encodeURIComponent(q)}&offset=${offset}`);
      const data = (await response.json()) as SearchPayload;
      if (gen !== searchGen.current) return;
      const incoming = data.results || [];
      setResults((current) => {
        const base = offset ? current : [];
        const seen = new Set(base.map((item) => item.id));
        return base.concat(incoming.filter((item) => !seen.has(item.id)));
      });
      setNextOffset(data.nextOffset);
      const count = (offset ? results.length : 0) + incoming.length;
      if (!incoming.length && !offset) {
        setStatusBad(true);
        setStatus(data.error || data.message || "No suitable Wikimedia media found for this search.");
      } else {
        const extra = data.errors?.length ? ` ${data.errors[0]}` : "";
        setStatus(`${incoming.length ? count : results.length} results · ${data.source || "Wikimedia Commons"}.${extra}`);
        setStatusBad(Boolean(data.errors?.length && !incoming.length));
      }
    } catch (error) {
      if (gen !== searchGen.current) return;
      setStatusBad(true);
      setStatus(error instanceof Error ? `Wikimedia search failed — ${error.message}` : "Wikimedia search failed — Retry");
    } finally {
      if (gen === searchGen.current) setSearching(false);
    }
  }

  function toggleAsset(asset: MediaAsset) {
    const exists = selectedRef.current.some((item) => item.id === asset.id);
    const next = exists ? selectedRef.current.filter((item) => item.id !== asset.id) : selectedRef.current.concat(asset);
    setSelected(next);
    selectedRef.current = next;
    invalidateReady("Selection changed. Build Preview to render this cut.");
  }

  function applyTemplate(id: string, preview: boolean) {
    const chosen = getTemplate(id);
    if (!chosen) return;
    setTemplateId(id);
    templateRef.current = chosen;
    const nextDuration = durationFor(chosen, speedRef.current);
    setDuration(nextDuration);
    durationRef.current = nextDuration;
    setWorkspace("preview");
    if (preview) {
      void runBuild({ autoplay: true, demo: selectedRef.current.length === 0, templateId: id });
      return;
    }
    invalidateReady(`Template set: ${chosen.name}\nBuild Preview to render the selected media.`);
    setScenes(selectedRef.current.length ? buildScenes(chosen, selectedRef.current) : []);
  }

  function onStop() {
    runId.current += 1;
    playToken.current += 1;
    playingRef.current = false;
    buildingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    stopAudio();
    for (const item of loadedRef.current.values()) item.video?.pause();
    setPhase(readyRef.current ? "ready" : "idle");
    setProgress(readyRef.current ? "Stopped" : "");
  }

  async function onExport() {
    if (buildingRef.current) return;
    if (!selectedRef.current.length) {
      setQc(qcFail({ reason: "Export needs selected media.", fix: "Select at least one photo or video, then Build Preview." }));
      setWorkspace("media");
      return;
    }
    setWorkspace("preview");
    onStop();
    const built = await runBuild({ autoplay: false, demo: false });
    if (!built || !readyRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.captureStream !== "function") {
      setQc(qcFail({ reason: "This browser cannot capture the canvas.", fix: "Use a current version of Chrome, Edge, or Firefox." }));
      return;
    }
    const token = ++playToken.current;
    // Resolve the first scene's video seeks before recording starts. Otherwise a slow
    // first seek can leave the recorder capturing a stale/blank opening frame.
    try {
      sceneMark.current = -1;
      await syncVideos(0);
      const initialCtx = canvas.getContext("2d");
      if (!initialCtx) throw new Error("Preview canvas is not available.");
      const initial = paintFrame(initialCtx, paintInput(0.001, false));
      if (!initial.drewMedia || initial.missingTitle || !frameHasContent(initialCtx)) {
        throw new Error("The opening frame could not be rendered completely.");
      }
    } catch (error) {
      for (const item of loadedRef.current.values()) item.video?.pause();
      setPhase("failed");
      setProgress("");
      setQc(qcFail({
        template: templateRef.current.name,
        reason: error instanceof Error ? error.message : "Opening frame preparation failed.",
        fix: "Re-select the affected video or use a photo, then Build Preview again.",
      }));
      return;
    }
    const stream = canvas.captureStream(30);
    let exportAudio: HTMLAudioElement | null = null;
    const track = musicRef.current;
    if (track?.audio) {
      try {
        exportAudio = audioRef.current ?? new Audio();
        audioRef.current = exportAudio;
        exportAudio.crossOrigin = "anonymous";
        if (exportAudio.dataset.track !== track.id) {
          exportAudio.src = track.audio;
          exportAudio.dataset.track = track.id;
        }
        const context = new AudioContext();
        if (context.state === "suspended") await context.resume();
        const source = context.createMediaElementSource(exportAudio);
        const dest = context.createMediaStreamDestination();
        source.connect(dest);
        source.connect(context.destination);
        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) stream.addTrack(audioTrack);
        exportAudio.currentTime = Math.max(0, trimRef.current.start || 0);
        await exportAudio.play();
      } catch {
        setQc((current) => `${current}\nAudio could not be attached. Video export continues.`);
        exportAudio = null;
      }
    }
    const mime =
      ["video/webm;codecs=vp8,opus", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8", "video/webm"].find((item) =>
        MediaRecorder.isTypeSupported(item),
      ) || "video/webm";
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
    } catch (error) {
      stream.getTracks().forEach((item) => item.stop());
      setQc(qcFail({ reason: error instanceof Error ? error.message : "Recording is not available.", fix: "Try another browser." }));
      return;
    }
    const chunks: Blob[] = [];
    let recorderError: DOMException | null = null;
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    const stopped = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.onerror = (event) => {
        recorderError = (event as Event & { error?: DOMException }).error ?? new DOMException("Video recording failed.");
      };
    });
    // Emit regular chunks as well as the final stop chunk, so longer exports are
    // less vulnerable to a single large buffered recording in browser memory.
    recorder.start(1000);
    setPhase("building");
    const started = performance.now();
    const total = durationRef.current;
    sceneMark.current = 0;
    playingRef.current = true;
    while (playingRef.current && playToken.current === token) {
      const elapsed = (performance.now() - started) / 1000;
      if (elapsed >= total) break;
      try {
        await syncVideos(elapsed);
      } catch (error) {
        playingRef.current = false;
        try {
          recorder.stop();
        } catch {
          /* already stopped */
        }
        setPhase("failed");
        setQc(qcFail({ template: templateRef.current.name, reason: error instanceof Error ? error.message : "Export frame failed.", fix: "Re-select the asset." }));
        stream.getTracks().forEach((item) => item.stop());
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) break;
      const painted = paintFrame(ctx, paintInput(elapsed, false));
      if (!painted.drewMedia || painted.missingTitle) {
        playingRef.current = false;
        try {
          recorder.stop();
        } catch {
          /* already stopped */
        }
        readyRef.current = false;
        setPhase("failed");
        setQc(
          qcFail({
            scene: painted.sceneIndex + 1,
            template: templateRef.current.name,
            asset: painted.missingTitle,
            reason: "A frame could not be rendered during export.",
            fix: "Re-select the asset and build again.",
          }),
        );
        stream.getTracks().forEach((item) => item.stop());
        return;
      }
      setProgress(`Creating reel… ${Math.min(99, Math.round((elapsed / total) * 100))}%`);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    }
    const ctx = canvas.getContext("2d");
    if (ctx) paintFrame(ctx, paintInput(Math.max(0, total - 0.001), false));
    exportAudio?.pause();
    for (const item of loadedRef.current.values()) item.video?.pause();
    try {
      if (recorder.state !== "inactive") recorder.stop();
      await stopped;
    } catch (error) {
      stream.getTracks().forEach((item) => item.stop());
      setPhase("failed");
      setProgress("");
      setQc(qcFail({
        template: templateRef.current.name,
        reason: error instanceof Error ? error.message : "The recorder did not finalize the complete video.",
        fix: "Keep this tab open and export again. If it repeats, try Chrome or Edge.",
      }));
      return;
    } finally {
      stream.getTracks().forEach((item) => item.stop());
    }
    if (recorderError) {
      setPhase("failed");
      setProgress("");
      setQc(qcFail({ reason: recorderError.message, fix: "Export again in a current Chrome or Edge browser." }));
      return;
    }
    const webm = new Blob(chunks, { type: mime });
    if (webm.size < 1024) {
      setPhase("failed");
      setQc(qcFail({ reason: "Recording was empty.", fix: "Build Preview again, then export." }));
      return;
    }
    setProgress("Converting to MP4 / H.264…");
    const slug = templateRef.current.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    try {
      const converted = await fetch("/api/convert-mp4", {
        method: "POST",
        headers: { "content-type": "video/webm" },
        body: webm,
        signal: AbortSignal.timeout(300000),
      });
      if (!converted.ok) {
        const detail = await converted.text();
        throw new Error(detail.slice(0, 240) || `Server returned ${converted.status}`);
      }
      const type = converted.headers.get("content-type") || "";
      if (!type.includes("video/mp4")) throw new Error("Server did not return video/mp4");
      const mp4 = await converted.blob();
      const head = new Uint8Array(await mp4.slice(0, 32).arrayBuffer());
      const sig = String.fromCharCode(...head.slice(4, 8));
      if (sig !== "ftyp") throw new Error("Converted file is not a valid MP4");
      downloadBlob(mp4, `reel-${slug}.mp4`);
      readyRef.current = true;
      setPhase("ready");
      setProgress("Ready");
      setQc(`READY\n\nExport verified\nMP4 / H.264\n1080×1920 · 30 FPS\n${Math.round(mp4.size / 1024)} KB\nTemplate: ${templateRef.current.name}`);
    } catch (error) {
      downloadBlob(webm, `reel-${slug}.webm`);
      setPhase("failed");
      setProgress("");
      setQc(
        qcFail({
          template: templateRef.current.name,
          reason: `MP4 conversion failed (${error instanceof Error ? error.message : "unknown"}). A WebM backup was saved.`,
          fix: "Try export again. Instagram Edits needs the MP4.",
        }),
      );
    }
  }

  async function onMusicSearch() {
    const q = musicQuery.trim();
    if (!q) return;
    setMusicStatus("Searching licensed music…");
    try {
      const response = await fetch(`/api/music-search?q=${encodeURIComponent(q)}`);
      const data = (await response.json()) as { results?: Track[]; message?: string; error?: string; source?: string };
      if (!response.ok) throw new Error(data.error || "Music search failed");
      setTracks(data.results || []);
      setMusicStatus(data.results?.length ? `${data.results.length} tracks · ${data.source || "Catalog"}` : data.message || "No playable tracks.");
    } catch (error) {
      setTracks([]);
      setMusicStatus(error instanceof Error ? error.message : "Music search failed");
    }
  }

  const photoCount = results.filter((asset) => asset.kind === "image").length;
  const videoCount = results.filter((asset) => asset.kind === "video").length;

  return (
    <div className="studio">
      <aside className="rail">
        <div className="brand">
          Festival of Bharat
          <small>Reel studio</small>
        </div>
        <nav>
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.id === "professional"
              ? workspace === "templates" && templateTab === "professional"
              : workspace === item.id;
            return (
              <button
                key={item.id}
                data-testid={item.id === "professional" ? "professional-main-nav" : undefined}
                className={active ? "active" : ""}
                type="button"
                aria-label={item.id === "professional" ? "Open Reel Styles" : item.label}
                onClick={() => {
                  if (item.id === "professional") {
                    setWorkspace("templates");
                    setTemplateTab("professional");
                    setOpenSection(null);
                    setTemplateQuery("");
                  } else {
                    setWorkspace(item.id);
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <div className="desk">
        <header className="topbar">
          <div>
            <h1>Festival of Bharat Studio</h1>
            <p className="lede">Browse templates by category, pick one, then build it with your media.</p>
          </div>
          <button
            className="primary"
            type="button"
            disabled={phase === "building"}
            onClick={() => {
              setWorkspace("preview");
              void runBuild({ autoplay: true, demo: false });
            }}
          >
            {phase === "building" ? "BUILDING…" : "Build Preview"}
          </button>
        </header>
        <section className="stats">
          <div className="stat">
            <span>Photos</span>
            <strong>{photoCount}</strong>
          </div>
          <div className="stat">
            <span>Videos</span>
            <strong>{videoCount}</strong>
          </div>
          <div className="stat">
            <span>Selected</span>
            <strong>{selected.length}</strong>
          </div>
          <div className="stat">
            <span>Template</span>
            <strong>{template.name}</strong>
          </div>
        </section>
        <div className="work">
          {workspace === "media" && (
            <section className="panel">
              <div className="searchRow">
                <input
                  className="field"
                  value={query}
                  aria-label="Search media"
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void onSearch(0);
                  }}
                />
                <button className="primary" type="button" disabled={searching} onClick={() => void onSearch(0)}>
                  {searching ? "Searching…" : "Search"}
                </button>
              </div>
              <p className={statusBad ? "status bad" : "status"}>{status}</p>
              <div className="row">
                <button className="ghost" type="button" onClick={() => document.getElementById("file-input")?.click()}>
                  Upload
                </button>
                <button
                  className="ghost"
                  type="button"
                  onClick={() => {
                    const additions = visible.filter((asset) => !selected.some((item) => item.id === asset.id));
                    if (!additions.length) return;
                    const next = selected.concat(additions);
                    setSelected(next);
                    selectedRef.current = next;
                    invalidateReady("Selection changed. Build Preview to render this cut.");
                  }}
                >
                  Select visible
                </button>
                <button
                  className="danger"
                  type="button"
                  onClick={() => {
                    setSelected([]);
                    selectedRef.current = [];
                    invalidateReady("Selection cleared.");
                  }}
                >
                  Clear
                </button>
                <input
                  id="file-input"
                  className="hiddenInput"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(event) => {
                    const files = [...(event.target.files || [])];
                    const imported: MediaAsset[] = files.map((file) => {
                      const url = URL.createObjectURL(file);
                      return {
                        id: `local-${crypto.randomUUID()}`,
                        title: file.name,
                        source: "Local upload",
                        kind: file.type.startsWith("video/") ? "video" : "image",
                        url,
                        thumb: url,
                        playUrl: url,
                        local: true,
                      };
                    });
                    setResults((current) => imported.concat(current));
                    setStatus(imported.length ? `${imported.length} file${imported.length === 1 ? "" : "s"} imported. Select each one to use it.` : status);
                    event.target.value = "";
                  }}
                />
              </div>
              <div className="tabs">
                {(
                  [
                    ["all", "All"],
                    ["image", "Photos"],
                    ["video", "Videos"],
                  ] as const
                ).map(([id, label]) => (
                  <button key={id} className={mediaTab === id ? "tab active" : "tab"} type="button" onClick={() => setMediaTab(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="mediaLayout">
                <div>
                  {visible.length === 0 && <p className="note">No cards yet. Search Wikimedia, or upload from this device.</p>}
                  <div className="cards">
                    {visible.map((asset) => {
                      const on = selected.some((item) => item.id === asset.id);
                      return (
                        <article key={asset.id} className={on ? "card chosen" : "card"}>
                          <MediaVisual asset={asset} />
                          <b title={asset.title}>{asset.title}</b>
                          <span className="meta">
                            {asset.source} · {asset.kind === "video" ? "Video" : "Photo"}
                            {asset.width ? ` · ${asset.width}×${asset.height || ""}` : ""}
                          </span>
                          {asset.license ? <span className="meta">{asset.license}</span> : null}
                          <div className="row">
                            <button className={on ? "primary" : "ghost"} type="button" onClick={() => toggleAsset(asset)}>
                              {on ? "Selected" : "Select"}
                            </button>
                            {asset.pageUrl ? (
                              <a className="ghost" href={asset.pageUrl} target="_blank" rel="noreferrer">
                                Source
                              </a>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  {nextOffset !== null && (
                    <div className="row" style={{ marginTop: 12 }}>
                      <button className="ghost" type="button" disabled={searching} onClick={() => void onSearch(nextOffset)}>
                        Load more results
                      </button>
                    </div>
                  )}
                </div>
                <aside className="panel">
                  <h2>Selected · {selected.length}</h2>
                  <div className="trace">
                    {selected.length === 0 && <p className="note">Nothing is selected. The reel will not pull media on its own.</p>}
                    {selected.map((asset, index) => (
                      <div key={asset.id}>
                        <b>{String(index + 1).padStart(2, "0")}</b>
                        <span>
                          {asset.title}
                          <button className="ghost" type="button" onClick={() => toggleAsset(asset)}>
                            Remove
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </section>
          )}
          {workspace === "templates" && (
            <section className="panel templates">
              <div className="row">
                <h2>Reel Templates</h2>
                <span className="note">{TEMPLATES.length} templates · 1080×1920</span>
              </div>
              <div className="searchRow">
                <input
                  className="field"
                  value={templateQuery}
                  aria-label="Search templates"
                  placeholder="Search Reel templates — cinematic, photo slideshow, travel, festival, product…"
                  onChange={(event) => {
                    setTemplateQuery(event.target.value);
                    setOpenSection(null);
                  }}
                />
              </div>
              <div className="tabs" role="tablist" aria-label="Template categories">
                {TEMPLATE_TABS.map((item) => (
                  <button
                    key={item.id}
                    id={item.id === "professional" ? "professional-template-tab" : undefined}
                    data-template-tab={item.id}
                    className={templateTab === item.id && !queryText ? "tab active" : "tab"}
                    type="button"
                    role="tab"
                    aria-label={item.id === "professional" ? "Reel Styles" : item.label}
                    aria-selected={templateTab === item.id && !queryText}
                    style={{ display: "inline-flex", flex: "0 0 auto", whiteSpace: "nowrap", visibility: "visible", opacity: 1 }}
                    onClick={() => {
                      setTemplateTab(item.id);
                      setOpenSection(null);
                      setTemplateQuery("");
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {queryText ? (
                <>
                  <div className="shelfHead">
                    <h3>Results for “{templateQuery.trim()}”</h3>
                    <span className="note">{searchHits.length}</span>
                  </div>
                  {searchHits.length === 0 ? (
                    <p className="note">No templates match that search. Try reel, story, poster, wedding, or quote.</p>
                  ) : (
                    <div className="gallery">
                      {visibleSearch.map((item) => (
                        <TemplateCard
                          key={item.id}
                          template={item}
                          active={item.id === template.id}
                          assets={selected}
                          title={title}
                          fontFamily={fontFamily}
                          fontScale={fontScale}
                          speed={speed}
                          duration={duration}
                          tick={thumbTick}
                          bitmap={bitmap}
                          onUse={() => applyTemplate(item.id, true)}
                        />
                      ))}
                    </div>
                  )}
                  {searchHits.length > visibleSearch.length && (
                    <button className="ghost" type="button" onClick={() => setTemplatePage((count) => count + 24)}>
                      Show more ({searchHits.length - visibleSearch.length} left)
                    </button>
                  )}
                </>
              ) : focusSection ? (
                <>
                  <div className="shelfHead">
                    <h3>{focusSection.heading}</h3>
                    <button className="textBtn" type="button" onClick={() => setOpenSection(null)}>
                      All {TEMPLATE_TABS.find((item) => item.id === templateTab)?.label}
                    </button>
                  </div>
                  <div className="tabs">
                    {shelves.map((section) => (
                      <button
                        key={section.id}
                        className={section.id === focusSection.id ? "tab active" : "tab"}
                        type="button"
                        onClick={() => setOpenSection(section.id)}
                      >
                        {section.heading}
                      </button>
                    ))}
                  </div>
                  <div className="gallery">
                    {visibleFocus.map((item) => (
                      <TemplateCard
                        key={item.id}
                        template={item}
                        active={item.id === template.id}
                        assets={selected}
                        title={title}
                        fontFamily={fontFamily}
                        fontScale={fontScale}
                        speed={speed}
                        duration={duration}
                        tick={thumbTick}
                        bitmap={bitmap}
                        onUse={() => applyTemplate(item.id, true)}
                      />
                    ))}
                  </div>
                  {focusTemplates.length > visibleFocus.length && (
                    <button className="ghost" type="button" onClick={() => setTemplatePage((count) => count + 24)}>
                      Show more ({focusTemplates.length - visibleFocus.length} left)
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="tabs headingTabs">
                    {shelves.map((section) => (
                      <button key={section.id} className="tab" type="button" onClick={() => setOpenSection(section.id)}>
                        {section.heading}
                      </button>
                    ))}
                  </div>
                  {shelves.map((section) => {
                    const cards = templatesIn(section.id);
                    // Keep the category browser responsive: show a curated row first,
                    // with the complete set available through "See all".
                    const shelfCards = cards.slice(0, 8);
                    return (
                      <div className="shelf" key={section.id}>
                        <div className="shelfHead">
                          <h3>{section.heading}</h3>
                          <button className="textBtn" type="button" onClick={() => setOpenSection(section.id)}>
                            See all {cards.length}
                          </button>
                        </div>
                        <div className="shelfRow">
                          {shelfCards.map((item) => (
                            <TemplateCard
                              key={item.id}
                              template={item}
                              active={item.id === template.id}
                              assets={selected}
                              title={title}
                              fontFamily={fontFamily}
                              fontScale={fontScale}
                              speed={speed}
                              duration={duration}
                              tick={thumbTick}
                              bitmap={bitmap}
                              onUse={() => applyTemplate(item.id, true)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </section>
          )}
          {workspace === "music" && (
            <section className="panel">
              <div className="searchRow">
                <input
                  className="field"
                  value={musicQuery}
                  aria-label="Search music"
                  onChange={(event) => setMusicQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void onMusicSearch();
                  }}
                />
                <button className="primary" type="button" onClick={() => void onMusicSearch()}>
                  Search
                </button>
              </div>
              <p className="status">{musicStatus}</p>
              <div className="row">
                <button className="ghost" type="button" onClick={() => document.getElementById("music-input")?.click()}>
                  Import audio
                </button>
                <label className="note">
                  Start
                  <input className="field" type="number" min={0} value={musicStart} onChange={(event) => setMusicStart(Number(event.target.value) || 0)} />
                </label>
                <label className="note">
                  End
                  <input className="field" type="number" min={0} value={musicEnd} onChange={(event) => setMusicEnd(Number(event.target.value) || 0)} />
                </label>
              </div>
              <input
                id="music-input"
                className="hiddenInput"
                type="file"
                accept="audio/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  const trackItem: Track = { id: `local-${Date.now()}`, name: file.name, artist_name: "Imported", duration: 0, audio: url, source: "Local", local: true };
                  setMusic(trackItem);
                  setMusicStatus(`Imported ${file.name}. Final Instagram music should still be added in Edits if the post needs their library.`);
                }}
              />
              <div className="music">
                {tracks.map((track) => (
                  <div key={track.id} className={music?.id === track.id ? "track selected" : "track"}>
                    {track.thumbnail ? <img src={track.thumbnail} alt="" /> : <span className="note">{track.source}</span>}
                    <div>
                      <b>{track.name}</b>
                      <div className="note">
                        {track.artist_name} · {track.source}
                        {track.duration ? ` · ${track.duration}s` : ""}
                      </div>
                    </div>
                    {track.audio ? (
                      <button
                        className="ghost"
                        type="button"
                        onClick={() => {
                          setMusic(track);
                          setMusicEnd(Math.min(duration, track.duration || duration));
                          setMusicStatus(`Selected ${track.name}`);
                        }}
                      >
                        {music?.id === track.id ? "Selected" : "Select"}
                      </button>
                    ) : track.landing ? (
                      <a className="ghost" href={track.landing} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="note">Instagram’s licensed library is not downloaded here. Add that music in Instagram Edits after you export the picture master.</p>
            </section>
          )}
          {workspace === "type" && (
            <section className="panel">
              <label className="slider">
                Caption
                <input className="field" value={title} placeholder="Caption on the reel" onChange={(event) => setTitle(event.target.value)} />
              </label>
              <div className="tabs">
                {Object.keys(LANGS).map((lang) => (
                  <button key={lang} className="tab" type="button" onClick={() => setTitle(LANGS[lang] || "")}>
                    {lang}
                  </button>
                ))}
              </div>
              <label className="slider">
                Font
                <select className="select" value={fontFamily} onChange={(event) => setFontFamily(event.target.value)}>
                  {Array.from(new Set([...FONTS, fontFamily])).map((font) => (
                    <option key={font}>{font}</option>
                  ))}
                </select>
              </label>
              <label className="slider">
                Size {Math.round(fontScale * 100)}%
                <input type="range" min={0.8} max={1.25} step={0.01} value={fontScale} onChange={(event) => setFontScale(Number(event.target.value))} />
              </label>
              <p className="note">The caption is the only title drawn on the picture. Leave it blank for no title. The studio name is never written on the reel. Long names wrap and scale down instead of leaving the frame.</p>
              <button className="ghost" type="button" onClick={() => document.getElementById("font-input")?.click()}>
                Upload font
              </button>
              <input
                id="font-input"
                className="hiddenInput"
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    const name = `Custom ${file.name.replace(/\.[^.]+$/, "")}`;
                    const face = new FontFace(name, await file.arrayBuffer());
                    await face.load();
                    document.fonts.add(face);
                    setFontFamily(name);
                  } catch {
                    setQc("QC FAILED\n\nReason: That font file could not be loaded.\n\nFix: Use a TTF, OTF, WOFF, or WOFF2 file.");
                  }
                }}
              />
            </section>
          )}
          {workspace === "preview" && (
            <section className="previewLayout">
              <div className="panel">
                <h2>{template.name}</h2>
                <p className="note">{template.description}</p>
                <p className="status">{progress || phase}</p>
                <div className="tabs">
                  {(["slow", "medium", "fast", "mixed"] as Speed[]).map((item) => (
                    <button
                      key={item}
                      className={speed === item ? "tab active" : "tab"}
                      type="button"
                      onClick={() => {
                        setSpeed(item);
                        const next = durationFor(template, item);
                        setDuration(next);
                        durationRef.current = next;
                        if (readyRef.current) invalidateReady("Speed changed. Build Preview again so timing matches.");
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <label className="slider">
                  Duration {duration}s
                  <input
                    type="range"
                    min={8}
                    max={40}
                    value={duration}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setDuration(next);
                      durationRef.current = next;
                      if (readyRef.current) invalidateReady("Duration changed. Build Preview again.");
                    }}
                  />
                </label>
                <div className="row">
                  <button className="primary" type="button" disabled={phase === "building"} onClick={() => void runBuild({ autoplay: true, demo: false })}>
                    {phase === "building" ? "BUILDING…" : "Build"}
                  </button>
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => {
                      if (readyRef.current) startLoop(++playToken.current, demoRef.current);
                      else void runBuild({ autoplay: true, demo: selected.length === 0 });
                    }}
                  >
                    Play
                  </button>
                  <button className="ghost" type="button" onClick={onStop}>
                    Stop
                  </button>
                  <button className="primary" type="button" disabled={!downloadReady || phase === "building"} onClick={() => void onExport()}>
                    {phase === "building" && downloadReady ? "Preparing download…" : "Download reel"}
                  </button>
                </div>
                <pre className="qc">{qc}</pre>
                <div className="trace">
                  {(scenes.length ? scenes : plan).map((scene) => (
                    <div key={`${scene.index}-${scene.assets.map((asset) => asset.id).join("-")}`}>
                      <b>{String(scene.index + 1).padStart(2, "0")}</b>
                      <span>
                        {scene.label} — {scene.assets.map((asset) => asset.title).join(" · ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <div className="phone">
                  <canvas ref={canvasRef} width={1080} height={1920} />
                </div>
                <div className="downloadBar">
                  <button className="primary" type="button" disabled={!downloadReady || phase === "building"} onClick={() => void onExport()}>
                    {phase === "building" && downloadReady ? "Preparing download…" : "Download reel"}
                  </button>
                  <p className="note">
                    {downloadReady
                      ? "Preview is ready. Download saves this exact 1080×1920 reel as an MP4."
                      : "Build Preview first. Download turns on only after the reel is actually ready."}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <nav className="dock">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.id === "professional"
            ? workspace === "templates" && templateTab === "professional"
            : workspace === item.id;
          return (
            <button
              key={item.id}
              className={active ? "active" : ""}
              type="button"
              aria-label={item.id === "professional" ? "Open Reel Styles" : item.label}
              onClick={() => {
                if (item.id === "professional") {
                  setWorkspace("templates");
                  setTemplateTab("professional");
                  setOpenSection(null);
                  setTemplateQuery("");
                } else {
                  setWorkspace(item.id);
                }
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function MediaVisual({ asset }: { asset: MediaAsset }) {
  const [src, setSrc] = useState(asset.local ? asset.thumb : asset.thumb || asset.playUrl);
  if (asset.kind === "video" && asset.local) {
    return <video src={asset.playUrl} muted playsInline preload="metadata" />;
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => {
        const fallback = proxied(asset.thumb || asset.playUrl || asset.url);
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}

function downloadBlob(blob: Blob, filename: string) {
  // Keep the object URL alive long enough for large reels and slower downloads.
  // Triggering a download from a detached anchor can be unreliable in some browsers.
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Do not revoke early: the browser may still be streaming the blob to disk.
  window.setTimeout(() => URL.revokeObjectURL(url), 10 * 60 * 1000);
}
