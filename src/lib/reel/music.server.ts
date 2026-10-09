export type MusicTrack = {
  id: string;
  name: string;
  artist_name: string;
  duration: number;
  audio: string | null;
  license?: string;
  license_ccurl?: string;
  source: string;
  landing?: string;
  thumbnail?: string;
};

const UA = "FestivalOfBharatReelMaker/1.4 (cultural reel studio)";

async function searchJamendo(query: string): Promise<MusicTrack[]> {
  const client = process.env.JAMENDO_CLIENT_ID;
  if (!client) return [];
  const api = new URL("https://api.jamendo.com/v3.0/tracks/");
  for (const [key, value] of [
    ["client_id", client],
    ["format", "json"],
    ["limit", "40"],
    ["search", query],
    ["order", "relevance"],
    ["audioformat", "mp32"],
    ["include", "licenses musicinfo"],
  ] as const) {
    api.searchParams.set(key, value);
  }
  const response = await fetch(api, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Jamendo HTTP ${response.status}`);
  const data = (await response.json()) as {
    headers?: { status?: string; error_message?: string };
    results?: Array<{ id: number; name?: string; artist_name?: string; duration?: number; audio?: string; license_ccurl?: string; shareurl?: string; image?: string }>;
  };
  if (data.headers?.status && data.headers.status !== "success") throw new Error(data.headers.error_message || "Jamendo error");
  return (data.results || [])
    .filter((track) => track.audio)
    .map((track) => ({
      id: `jamendo-${track.id}`,
      name: track.name || "Untitled",
      artist_name: track.artist_name || "Unknown artist",
      duration: Number(track.duration) || 0,
      audio: track.audio || null,
      license_ccurl: track.license_ccurl || "",
      source: "Jamendo",
      landing: track.shareurl || "",
      thumbnail: track.image || "",
    }));
}

async function searchOpenverse(query: string): Promise<MusicTrack[]> {
  const api = new URL("https://api.openverse.org/v1/audio/");
  api.searchParams.set("q", query);
  api.searchParams.set("page_size", "40");
  const response = await fetch(api, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Openverse HTTP ${response.status}`);
  const data = (await response.json()) as {
    results?: Array<{
      id?: string;
      title?: string;
      url?: string;
      creator?: string;
      duration?: number;
      license?: string;
      license_url?: string;
      foreign_landing_url?: string;
      thumbnail?: string;
    }>;
  };
  const tracks: MusicTrack[] = [];
  for (const row of data.results || []) {
    if (!row.url || !row.id) continue;
    const durationRaw = Number(row.duration) || 0;
    const duration = durationRaw > 1000 ? Math.round(durationRaw / 1000) : Math.round(durationRaw);
    tracks.push({
      id: `openverse-${row.id}`,
      name: row.title || "Untitled audio",
      artist_name: row.creator || "Unknown creator",
      duration,
      audio: `/api/media-proxy?url=${encodeURIComponent(row.url)}`,
      license: row.license || "",
      license_ccurl: row.license_url || "",
      source: "Openverse",
      landing: row.foreign_landing_url || "",
      thumbnail: row.thumbnail || "",
    });
  }
  return tracks;
}

export async function searchMusic(query: string): Promise<{ results: MusicTrack[]; source: string; message?: string }> {
  const q = query.trim();
  if (!q) return { results: [], source: "Catalog", message: "Missing query" };
  const errors: string[] = [];
  let jamendo: MusicTrack[] = [];
  let openverse: MusicTrack[] = [];
  if (process.env.JAMENDO_CLIENT_ID) {
    try {
      jamendo = await searchJamendo(q);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Jamendo failed");
    }
  }
  try {
    openverse = await searchOpenverse(q);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Openverse audio failed");
  }
  const seen = new Set<string>();
  const results: MusicTrack[] = [];
  for (const track of [...jamendo, ...openverse]) {
    if (!track.audio || seen.has(track.id)) continue;
    seen.add(track.id);
    results.push(track);
  }
  return {
    results: results.slice(0, 80),
    source: "Jamendo + Openverse",
    message: results.length ? undefined : errors[0] || "No playable licensed tracks matched this search.",
  };
}
