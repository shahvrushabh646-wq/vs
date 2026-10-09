import type { MediaAsset, SearchPayload } from "./types";

const UA = "FestivalOfBharatReelMaker/1.4 (cultural reel studio; https://commons.wikimedia.org/)";

const HINTS: Array<[RegExp, string[]]> = [
  [/ganesh|ganapati|chaturthi|chinchpokli/i, ["Ganesh Chaturthi festival", "Ganapati visarjan India", "Ganesh idol procession"]],
  [/navratri|garba|durga/i, ["Navratri garba", "Durga Puja festival", "Navratri festival India"]],
  [/shivaratri|shivratri|mahashiv/i, ["Mahashivratri", "Shiva temple night India"]],
  [/holi/i, ["Holi festival India", "Holi colors"]],
  [/diwali|deepavali/i, ["Diwali festival India", "Deepavali lamps"]],
  [/girnar/i, ["Girnar mountain temple", "Girnar Jain temple"]],
  [/janmashtami|krishna/i, ["Krishna Janmashtami", "Dahi handi"]],
  [/pongal|onam|baisakhi|lohri|bihu/i, ["India harvest festival"]],
];

type ImageInfo = {
  url?: string;
  thumburl?: string;
  mime?: string;
  width?: number;
  height?: number;
  size?: number;
  mediatype?: string;
  descriptionurl?: string;
  extmetadata?: Record<string, { value?: string } | undefined>;
};

type Page = { pageid?: number; title?: string; imageinfo?: ImageInfo[] };

const memory = new Map<string, { at: number; body: SearchPayload }>();

function stripHtml(value: string | undefined): string {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/&#039;|'/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function log(entry: Record<string, unknown>) {
  console.info("[media-search]", JSON.stringify(entry));
}

async function fetchJson(url: string, ms = 12000): Promise<{ status: number; data: unknown; ms: number }> {
  const started = Date.now();
  let last = "request failed";
  let wait = 350;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal: AbortSignal.timeout(ms),
      });
      const text = await response.text();
      const elapsed = Date.now() - started;
      if (response.status === 429 || response.status >= 500) {
        last = `HTTP ${response.status}`;
        log({ provider: "upstream", status: response.status, ms: elapsed, attempt, url: url.slice(0, 180) });
        await new Promise((resolve) => setTimeout(resolve, wait));
        wait *= 2;
        continue;
      }
      if (!response.ok) {
        log({ provider: "upstream", status: response.status, ms: elapsed, body: text.slice(0, 180) });
        throw new Error(`HTTP ${response.status}`);
      }
      try {
        return { status: response.status, data: JSON.parse(text) as unknown, ms: elapsed };
      } catch {
        throw new Error("response was not JSON");
      }
    } catch (error) {
      last = error instanceof Error ? error.message : "request failed";
      if (attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, wait));
      wait *= 2;
    }
  }
  throw new Error(last);
}

export function variantsFor(query: string): string[] {
  const clean = query.replace(/\s+/g, " ").trim();
  const extra = HINTS.find(([pattern]) => pattern.test(clean))?.[1] ?? [];
  const list = [clean];
  if (!/india|festival|temple/i.test(clean)) list.push(`${clean} festival India`);
  for (const item of extra) if (!list.some((value) => value.toLowerCase() === item.toLowerCase())) list.push(item);
  return list.slice(0, 3);
}

function rejectTitle(title: string): boolean {
  return /(icon|logo|pictogram|coat of arms|locator map|flag of|diagram|watermark|symbol|svg\b|banner\b)/i.test(title);
}

function mapPage(page: Page): MediaAsset | null {
  const info = page.imageinfo?.[0];
  if (!info?.url || !page.pageid) return null;
  const mime = String(info.mime || "").toLowerCase();
  const kind = mime.startsWith("video/") ? "video" : mime.startsWith("image/") ? "image" : "";
  if (!kind || mime.includes("svg") || info.mediatype === "AUDIO" || info.mediatype === "TEXT") return null;
  if (kind === "video" && !/video\/(webm|mp4|ogg|ogv)/.test(mime) && !mime.startsWith("video/")) return null;
  const title = String(page.title || "Untitled").replace(/^File:/, "");
  if (rejectTitle(title)) return null;
  if (kind === "image" && info.width && info.width < 640) return null;
  if (kind === "video" && info.size && info.size > 90_000_000) return null;
  const thumb = info.thumburl || info.url;
  if (!thumb) return null;
  const playUrl = kind === "image" ? thumb : info.url;
  return {
    id: `wm-${page.pageid}`,
    title,
    source: "Wikimedia Commons",
    kind,
    url: info.url,
    originalUrl: info.url,
    thumb,
    playUrl,
    width: info.width,
    height: info.height,
    mime,
    license: stripHtml(info.extmetadata?.LicenseShortName?.value),
    licenseUrl: stripHtml(info.extmetadata?.LicenseUrl?.value),
    author: stripHtml(info.extmetadata?.Artist?.value),
    pageUrl: info.descriptionurl,
  };
}

async function searchCommons(term: string, offset: number, fileType: "bitmap" | "video"): Promise<{ items: MediaAsset[]; more: boolean; error?: string }> {
  const query = fileType === "video" ? `${term} filetype:video` : `${term} filetype:bitmap`;
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  const params: Record<string, string> = {
    action: "query",
    format: "json",
    formatversion: "2",
    origin: "*",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: fileType === "video" ? "20" : "30",
    gsrwhat: "text",
    prop: "imageinfo",
    iiprop: "url|size|mime|mediatype|extmetadata",
    iiextmetadatafilter: "LicenseShortName|Artist|LicenseUrl",
    iiurlwidth: "1400",
  };
  if (offset > 0) params.gsroffset = String(offset);
  for (const [key, value] of Object.entries(params)) api.searchParams.set(key, value);
  try {
    const { data, status, ms } = await fetchJson(api.toString(), 12000);
    const body = data as { query?: { pages?: Page[] }; continue?: { gsroffset?: number }; error?: { info?: string } };
    if (body.error) throw new Error(body.error.info || "Wikimedia API error");
    const items = (body.query?.pages || []).map(mapPage).filter((item): item is MediaAsset => !!item && (fileType === "video" ? item.kind === "video" : item.kind === "image"));
    log({ provider: "wikimedia", query, status, ms, count: items.length, offset });
    return { items, more: typeof body.continue?.gsroffset === "number" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Wikimedia request failed";
    log({ provider: "wikimedia", query, error: message, offset });
    return { items: [], more: false, error: `Wikimedia ${fileType}: ${message}` };
  }
}

async function searchOpenverse(term: string): Promise<{ items: MediaAsset[]; error?: string }> {
  const api = new URL("https://api.openverse.org/v1/images/");
  api.searchParams.set("q", term);
  api.searchParams.set("page_size", "30");
  try {
    const { data, status, ms } = await fetchJson(api.toString(), 10000);
    const body = data as {
      results?: Array<{
        id?: string;
        title?: string;
        url?: string;
        thumbnail?: string;
        width?: number;
        height?: number;
        license?: string;
        license_url?: string;
        creator?: string;
        foreign_landing_url?: string;
      }>;
    };
    const items: MediaAsset[] = [];
    for (const row of body.results || []) {
      if (!row.url || !row.id) continue;
      if (row.width && row.width < 640) continue;
      const title = row.title || "Untitled";
      if (rejectTitle(title)) continue;
      items.push({
        id: `ov-${row.id}`,
        title,
        source: "Openverse",
        kind: "image",
        url: row.url,
        originalUrl: row.url,
        thumb: row.thumbnail || row.url,
        playUrl: row.url,
        width: row.width,
        height: row.height,
        license: row.license || "",
        licenseUrl: row.license_url || "",
        author: row.creator || "",
        pageUrl: row.foreign_landing_url || "",
      });
    }
    log({ provider: "openverse", query: term, status, ms, count: items.length });
    return { items };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Openverse request failed";
    log({ provider: "openverse", query: term, error: message });
    return { items: [], error: `Openverse photos: ${message}` };
  }
}

export async function searchMedia(rawQuery: string, offset = 0): Promise<SearchPayload> {
  const query = rawQuery.replace(/\s+/g, " ").trim().slice(0, 180);
  if (!query) {
    return { results: [], nextOffset: null, source: "Wikimedia Commons", counts: { photos: 0, videos: 0 }, errors: ["Missing query"], error: "Missing query" };
  }
  const cacheKey = `${query.toLowerCase()}|${offset}`;
  const cached = memory.get(cacheKey);
  if (cached && Date.now() - cached.at < 120_000 && cached.body.results.length) return cached.body;

  const variants = variantsFor(query);
  const primary = variants[0] || query;
  const [photos, videos] = await Promise.all([searchCommons(primary, offset, "bitmap"), searchCommons(primary, offset, "video")]);
  const errors = [photos.error, videos.error].filter((item): item is string => !!item);
  let images = photos.items;
  if (offset === 0 && images.length < 8 && variants[1]) {
    const extra = await searchCommons(variants[1], 0, "bitmap");
    if (extra.error) errors.push(extra.error);
    images = images.concat(extra.items);
  }
  if (offset === 0 && images.length < 4) {
    const extra = await searchOpenverse(primary);
    if (extra.error) errors.push(extra.error);
    images = images.concat(extra.items);
  }

  const seen = new Set<string>();
  const results: MediaAsset[] = [];
  const add = (asset: MediaAsset) => {
    const key = `${asset.kind}|${(asset.originalUrl || asset.url).split("?")[0]}|${asset.title.toLowerCase()}`;
    if (seen.has(asset.id) || seen.has(key)) return;
    seen.add(asset.id);
    seen.add(key);
    results.push(asset);
  };
  for (const asset of images) if (asset.kind === "image") add(asset);
  for (const asset of videos.items) if (asset.kind === "video") add(asset);

  const photoCount = results.filter((item) => item.kind === "image").length;
  const videoCount = results.filter((item) => item.kind === "video").length;
  const more = photos.more || videos.more;
  const payload: SearchPayload = {
    results: results.slice(0, 80),
    nextOffset: more ? offset + 30 : null,
    source: videoCount && photoCount ? "Wikimedia Commons" : photoCount ? "Wikimedia Commons / Openverse" : "Wikimedia Commons",
    counts: { photos: photoCount, videos: videoCount },
    errors,
    message: results.length ? undefined : errors[0] || "No suitable media found for this search.",
    error: results.length ? undefined : errors[0] || "No suitable Wikimedia media found for this search.",
  };
  if (results.length) memory.set(cacheKey, { at: Date.now(), body: payload });
  return payload;
}
