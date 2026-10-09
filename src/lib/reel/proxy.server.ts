const UA = "FestivalOfBharatReelMaker/1.4 (cultural reel studio; https://commons.wikimedia.org/)";

function blockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || host === "::1") return true;
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
  return false;
}

export async function proxyMedia(request: Request): Promise<Response> {
  const target = new URL(request.url).searchParams.get("url");
  if (!target) return new Response("Missing url", { status: 400, headers: { "content-type": "text/plain" } });
  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400, headers: { "content-type": "text/plain" } });
  }
  if (!["http:", "https:"].includes(parsed.protocol) || blockedHost(parsed.hostname)) {
    return new Response("Unsupported url", { status: 400, headers: { "content-type": "text/plain" } });
  }
  const headers = new Headers();
  headers.set("User-Agent", UA);
  headers.set("Accept", "image/avif,image/webp,image/*,video/*,*/*;q=0.8");
  const range = request.headers.get("range");
  if (range) headers.set("Range", range);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const upstream = await fetch(parsed, { headers, redirect: "follow", signal: controller.signal });
    clearTimeout(timer);
    const type = String(upstream.headers.get("content-type") || "");
    if (type.includes("text/html")) {
      return new Response("Upstream returned HTML instead of media", { status: 502, headers: { "content-type": "text/plain", "cache-control": "no-store" } });
    }
    if (!upstream.ok && upstream.status !== 206) {
      return new Response(`Upstream ${upstream.status}`, { status: upstream.status, headers: { "content-type": "text/plain", "cache-control": "no-store" } });
    }
    if (!upstream.body) return new Response("Upstream media body missing", { status: 502, headers: { "content-type": "text/plain" } });
    const out = new Headers();
    out.set("Access-Control-Allow-Origin", "*");
    out.set("Access-Control-Expose-Headers", "Accept-Ranges, Content-Length, Content-Range, Content-Type");
    out.set("Accept-Ranges", upstream.headers.get("accept-ranges") || "bytes");
    out.set("Cache-Control", "public, max-age=3600");
    out.set("Content-Type", type || "application/octet-stream");
    for (const name of ["content-length", "content-range"]) {
      const value = upstream.headers.get(name);
      if (value) out.set(name, value);
    }
    return new Response(request.method === "HEAD" ? null : upstream.body, { status: upstream.status === 206 ? 206 : 200, headers: out });
  } catch (error) {
    clearTimeout(timer);
    const message = error instanceof Error ? error.message : "Proxy failed";
    return new Response(`Proxy failed: ${message}`, { status: 502, headers: { "content-type": "text/plain", "cache-control": "no-store" } });
  }
}
