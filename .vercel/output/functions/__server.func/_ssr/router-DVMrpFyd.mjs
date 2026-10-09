import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { K as require_react, _ as createFileRoute, b as require_jsx_runtime, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DVMrpFyd.js
var router_DVMrpFyd_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-CMhDAY3A.css";
var APP_NAME = "Festival of Bharat Studio";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Search real festival media, choose a reel template, and export a 1080×1920 cut."
			},
			{
				name: "theme-color",
				content: "#0b0d10"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,500&family=Playfair+Display:ital,wght@0,500;0,700;1,600&family=Noto+Sans:wght@500;700&family=Noto+Sans+Bengali:wght@600;700&family=Noto+Sans+Devanagari:wght@600;700&family=Noto+Sans+Gujarati:wght@600;700&family=Noto+Sans+Gurmukhi:wght@600;700&family=Noto+Sans+Kannada:wght@600;700&family=Noto+Sans+Malayalam:wght@600;700&family=Noto+Sans+Tamil:wght@600;700&family=Noto+Sans+Telugu:wght@600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter = () => import("./routes-UE7U_9ly.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function encoderPath() {
	return [
		process.env.FFMPEG_PATH,
		"/usr/local/bin/ffmpeg",
		"/usr/bin/ffmpeg"
	].filter((item) => Boolean(item)).find((item) => existsSync(item)) ?? null;
}
async function convertWebmToMp4(data) {
	const bin = encoderPath();
	if (!bin || !existsSync(bin)) throw new Error("MP4 encoder is not available on this server");
	const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	const input = resolve(tmpdir(), `reel-${stamp}.webm`);
	const output = resolve(tmpdir(), `reel-${stamp}.mp4`);
	await writeFile(input, data);
	try {
		await new Promise((resolveDone, reject) => {
			const child = spawn(bin, [
				"-hide_banner",
				"-loglevel",
				"error",
				"-y",
				"-i",
				input,
				"-map",
				"0:v:0",
				"-map",
				"0:a:0?",
				"-c:v",
				"libx264",
				"-preset",
				"veryfast",
				"-profile:v",
				"high",
				"-pix_fmt",
				"yuv420p",
				"-r",
				"30",
				"-movflags",
				"+faststart",
				"-c:a",
				"aac",
				"-b:a",
				"192k",
				output
			]);
			let err = "";
			const timer = setTimeout(() => {
				try {
					child.kill("SIGKILL");
				} catch {}
				reject(/* @__PURE__ */ new Error("FFmpeg conversion timed out"));
			}, 3e5);
			child.stderr.on("data", (chunk) => {
				err += chunk.toString();
			});
			child.on("error", (error) => {
				clearTimeout(timer);
				reject(error);
			});
			child.on("close", (code) => {
				clearTimeout(timer);
				if (code === 0) resolveDone();
				else reject(new Error(err.slice(-500) || "FFmpeg conversion failed"));
			});
		});
		const mp4 = await readFile(output);
		if (mp4.length < 1e3) throw new Error("FFmpeg produced an unexpectedly small MP4");
		if (mp4.subarray(4, 8).toString("ascii") !== "ftyp") throw new Error("FFmpeg output is not a valid MP4");
		return mp4;
	} finally {
		await Promise.allSettled([unlink(input), unlink(output)]);
	}
}
var MAX = 188743680;
var Route$3 = createFileRoute("/api/convert-mp4")({ server: { handlers: { POST: async ({ request }) => {
	if (Number(request.headers.get("content-length") || 0) > MAX) return new Response(JSON.stringify({ error: "Video too large" }), {
		status: 413,
		headers: { "content-type": "application/json" }
	});
	const data = new Uint8Array(await request.arrayBuffer());
	if (!data.byteLength) return new Response(JSON.stringify({ error: "Empty video upload" }), {
		status: 400,
		headers: { "content-type": "application/json" }
	});
	if (data.byteLength > MAX) return new Response(JSON.stringify({ error: "Video too large" }), {
		status: 413,
		headers: { "content-type": "application/json" }
	});
	try {
		const mp4 = Buffer.from(await convertWebmToMp4(data));
		return new Response(mp4, {
			status: 200,
			headers: {
				"content-type": "video/mp4",
				"content-length": String(mp4.byteLength),
				"content-disposition": "attachment; filename=\"reel.mp4\"",
				"cache-control": "no-store",
				"x-reel-format": "1080x1920 H.264 yuv420p 30fps"
			}
		});
	} catch (error) {
		const detail = error instanceof Error ? error.message : "MP4 conversion failed";
		return new Response(JSON.stringify({
			error: "MP4 conversion failed",
			detail
		}), {
			status: 500,
			headers: {
				"content-type": "application/json",
				"cache-control": "no-store"
			}
		});
	}
} } } });
var UA$2 = "FestivalOfBharatReelMaker/1.4 (cultural reel studio; https://commons.wikimedia.org/)";
function blockedHost(hostname) {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
	if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || host === "::1") return true;
	if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) return true;
	if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
	return false;
}
async function proxyMedia(request) {
	const target = new URL(request.url).searchParams.get("url");
	if (!target) return new Response("Missing url", {
		status: 400,
		headers: { "content-type": "text/plain" }
	});
	let parsed;
	try {
		parsed = new URL(target);
	} catch {
		return new Response("Invalid url", {
			status: 400,
			headers: { "content-type": "text/plain" }
		});
	}
	if (!["http:", "https:"].includes(parsed.protocol) || blockedHost(parsed.hostname)) return new Response("Unsupported url", {
		status: 400,
		headers: { "content-type": "text/plain" }
	});
	const headers = new Headers();
	headers.set("User-Agent", UA$2);
	headers.set("Accept", "image/avif,image/webp,image/*,video/*,*/*;q=0.8");
	const range = request.headers.get("range");
	if (range) headers.set("Range", range);
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 15e3);
	try {
		const upstream = await fetch(parsed, {
			headers,
			redirect: "follow",
			signal: controller.signal
		});
		clearTimeout(timer);
		const type = String(upstream.headers.get("content-type") || "");
		if (type.includes("text/html")) return new Response("Upstream returned HTML instead of media", {
			status: 502,
			headers: {
				"content-type": "text/plain",
				"cache-control": "no-store"
			}
		});
		if (!upstream.ok && upstream.status !== 206) return new Response(`Upstream ${upstream.status}`, {
			status: upstream.status,
			headers: {
				"content-type": "text/plain",
				"cache-control": "no-store"
			}
		});
		if (!upstream.body) return new Response("Upstream media body missing", {
			status: 502,
			headers: { "content-type": "text/plain" }
		});
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
		return new Response(request.method === "HEAD" ? null : upstream.body, {
			status: upstream.status === 206 ? 206 : 200,
			headers: out
		});
	} catch (error) {
		clearTimeout(timer);
		const message = error instanceof Error ? error.message : "Proxy failed";
		return new Response(`Proxy failed: ${message}`, {
			status: 502,
			headers: {
				"content-type": "text/plain",
				"cache-control": "no-store"
			}
		});
	}
}
var handle = ({ request }) => proxyMedia(request);
var Route$2 = createFileRoute("/api/media-proxy")({ server: { handlers: {
	GET: handle,
	HEAD: handle
} } });
var UA$1 = "FestivalOfBharatReelMaker/1.4 (cultural reel studio; https://commons.wikimedia.org/)";
var HINTS = [
	[/ganesh|ganapati|chaturthi|chinchpokli/i, [
		"Ganesh Chaturthi festival",
		"Ganapati visarjan India",
		"Ganesh idol procession"
	]],
	[/navratri|garba|durga/i, [
		"Navratri garba",
		"Durga Puja festival",
		"Navratri festival India"
	]],
	[/shivaratri|shivratri|mahashiv/i, ["Mahashivratri", "Shiva temple night India"]],
	[/holi/i, ["Holi festival India", "Holi colors"]],
	[/diwali|deepavali/i, ["Diwali festival India", "Deepavali lamps"]],
	[/girnar/i, ["Girnar mountain temple", "Girnar Jain temple"]],
	[/janmashtami|krishna/i, ["Krishna Janmashtami", "Dahi handi"]],
	[/pongal|onam|baisakhi|lohri|bihu/i, ["India harvest festival"]]
];
var memory = /* @__PURE__ */ new Map();
function stripHtml(value) {
	return String(value || "").replace(/<[^>]+>/g, " ").replace(/&/g, "&").replace(/"/g, "\"").replace(/&#039;|'/g, "'").replace(/</g, "<").replace(/>/g, ">").replace(/\s+/g, " ").trim().slice(0, 180);
}
function log(entry) {
	console.info("[media-search]", JSON.stringify(entry));
}
async function fetchJson(url, ms = 12e3) {
	const started = Date.now();
	let last = "request failed";
	let wait = 350;
	for (let attempt = 0; attempt < 3; attempt++) try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": UA$1,
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(ms)
		});
		const text = await response.text();
		const elapsed = Date.now() - started;
		if (response.status === 429 || response.status >= 500) {
			last = `HTTP ${response.status}`;
			log({
				provider: "upstream",
				status: response.status,
				ms: elapsed,
				attempt,
				url: url.slice(0, 180)
			});
			await new Promise((resolve) => setTimeout(resolve, wait));
			wait *= 2;
			continue;
		}
		if (!response.ok) {
			log({
				provider: "upstream",
				status: response.status,
				ms: elapsed,
				body: text.slice(0, 180)
			});
			throw new Error(`HTTP ${response.status}`);
		}
		try {
			return {
				status: response.status,
				data: JSON.parse(text),
				ms: elapsed
			};
		} catch {
			throw new Error("response was not JSON");
		}
	} catch (error) {
		last = error instanceof Error ? error.message : "request failed";
		if (attempt === 2) break;
		await new Promise((resolve) => setTimeout(resolve, wait));
		wait *= 2;
	}
	throw new Error(last);
}
function variantsFor(query) {
	const clean = query.replace(/\s+/g, " ").trim();
	const extra = HINTS.find(([pattern]) => pattern.test(clean))?.[1] ?? [];
	const list = [clean];
	if (!/india|festival|temple/i.test(clean)) list.push(`${clean} festival India`);
	for (const item of extra) if (!list.some((value) => value.toLowerCase() === item.toLowerCase())) list.push(item);
	return list.slice(0, 3);
}
function rejectTitle(title) {
	return /(icon|logo|pictogram|coat of arms|locator map|flag of|diagram|watermark|symbol|svg\b|banner\b)/i.test(title);
}
function mapPage(page) {
	const info = page.imageinfo?.[0];
	if (!info?.url || !page.pageid) return null;
	const mime = String(info.mime || "").toLowerCase();
	const kind = mime.startsWith("video/") ? "video" : mime.startsWith("image/") ? "image" : "";
	if (!kind || mime.includes("svg") || info.mediatype === "AUDIO" || info.mediatype === "TEXT") return null;
	if (kind === "video" && !/video\/(webm|mp4|ogg|ogv)/.test(mime) && !mime.startsWith("video/")) return null;
	const title = String(page.title || "Untitled").replace(/^File:/, "");
	if (rejectTitle(title)) return null;
	if (kind === "image" && info.width && info.width < 640) return null;
	if (kind === "video" && info.size && info.size > 9e7) return null;
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
		pageUrl: info.descriptionurl
	};
}
async function searchCommons(term, offset, fileType) {
	const query = fileType === "video" ? `${term} filetype:video` : `${term} filetype:bitmap`;
	const api = new URL("https://commons.wikimedia.org/w/api.php");
	const params = {
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
		iiurlwidth: "1400"
	};
	if (offset > 0) params.gsroffset = String(offset);
	for (const [key, value] of Object.entries(params)) api.searchParams.set(key, value);
	try {
		const { data, status, ms } = await fetchJson(api.toString(), 12e3);
		const body = data;
		if (body.error) throw new Error(body.error.info || "Wikimedia API error");
		const items = (body.query?.pages || []).map(mapPage).filter((item) => !!item && (fileType === "video" ? item.kind === "video" : item.kind === "image"));
		log({
			provider: "wikimedia",
			query,
			status,
			ms,
			count: items.length,
			offset
		});
		return {
			items,
			more: typeof body.continue?.gsroffset === "number"
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Wikimedia request failed";
		log({
			provider: "wikimedia",
			query,
			error: message,
			offset
		});
		return {
			items: [],
			more: false,
			error: `Wikimedia ${fileType}: ${message}`
		};
	}
}
async function searchOpenverse$1(term) {
	const api = new URL("https://api.openverse.org/v1/images/");
	api.searchParams.set("q", term);
	api.searchParams.set("page_size", "30");
	try {
		const { data, status, ms } = await fetchJson(api.toString(), 1e4);
		const body = data;
		const items = [];
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
				pageUrl: row.foreign_landing_url || ""
			});
		}
		log({
			provider: "openverse",
			query: term,
			status,
			ms,
			count: items.length
		});
		return { items };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Openverse request failed";
		log({
			provider: "openverse",
			query: term,
			error: message
		});
		return {
			items: [],
			error: `Openverse photos: ${message}`
		};
	}
}
async function searchMedia(rawQuery, offset = 0) {
	const query = rawQuery.replace(/\s+/g, " ").trim().slice(0, 180);
	if (!query) return {
		results: [],
		nextOffset: null,
		source: "Wikimedia Commons",
		counts: {
			photos: 0,
			videos: 0
		},
		errors: ["Missing query"],
		error: "Missing query"
	};
	const cacheKey = `${query.toLowerCase()}|${offset}`;
	const cached = memory.get(cacheKey);
	if (cached && Date.now() - cached.at < 12e4 && cached.body.results.length) return cached.body;
	const variants = variantsFor(query);
	const primary = variants[0] || query;
	const [photos, videos] = await Promise.all([searchCommons(primary, offset, "bitmap"), searchCommons(primary, offset, "video")]);
	const errors = [photos.error, videos.error].filter((item) => !!item);
	let images = photos.items;
	if (offset === 0 && images.length < 8 && variants[1]) {
		const extra = await searchCommons(variants[1], 0, "bitmap");
		if (extra.error) errors.push(extra.error);
		images = images.concat(extra.items);
	}
	if (offset === 0 && images.length < 4) {
		const extra = await searchOpenverse$1(primary);
		if (extra.error) errors.push(extra.error);
		images = images.concat(extra.items);
	}
	const seen = /* @__PURE__ */ new Set();
	const results = [];
	const add = (asset) => {
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
	const payload = {
		results: results.slice(0, 80),
		nextOffset: more ? offset + 30 : null,
		source: videoCount && photoCount ? "Wikimedia Commons" : photoCount ? "Wikimedia Commons / Openverse" : "Wikimedia Commons",
		counts: {
			photos: photoCount,
			videos: videoCount
		},
		errors,
		message: results.length ? void 0 : errors[0] || "No suitable media found for this search.",
		error: results.length ? void 0 : errors[0] || "No suitable Wikimedia media found for this search."
	};
	if (results.length) memory.set(cacheKey, {
		at: Date.now(),
		body: payload
	});
	return payload;
}
var Route$1 = createFileRoute("/api/media-search")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const query = url.searchParams.get("q") || "";
	const offset = Math.max(0, Number(url.searchParams.get("offset") || 0) || 0);
	try {
		const body = await searchMedia(query, offset);
		const status = body.results.length ? 200 : body.errors.length && !body.message?.startsWith("No suitable") ? 502 : 200;
		return new Response(JSON.stringify(body), {
			status,
			headers: {
				"content-type": "application/json",
				"cache-control": "no-store"
			}
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Search failed";
		return new Response(JSON.stringify({
			error: `Wikimedia search failed — ${message}`,
			results: [],
			errors: [message]
		}), {
			status: 502,
			headers: {
				"content-type": "application/json",
				"cache-control": "no-store"
			}
		});
	}
} } } });
var UA = "FestivalOfBharatReelMaker/1.4 (cultural reel studio)";
async function searchJamendo(query) {
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
		["include", "licenses musicinfo"]
	]) api.searchParams.set(key, value);
	const response = await fetch(api, {
		headers: { "User-Agent": UA },
		signal: AbortSignal.timeout(12e3)
	});
	if (!response.ok) throw new Error(`Jamendo HTTP ${response.status}`);
	const data = await response.json();
	if (data.headers?.status && data.headers.status !== "success") throw new Error(data.headers.error_message || "Jamendo error");
	return (data.results || []).filter((track) => track.audio).map((track) => ({
		id: `jamendo-${track.id}`,
		name: track.name || "Untitled",
		artist_name: track.artist_name || "Unknown artist",
		duration: Number(track.duration) || 0,
		audio: track.audio || null,
		license_ccurl: track.license_ccurl || "",
		source: "Jamendo",
		landing: track.shareurl || "",
		thumbnail: track.image || ""
	}));
}
async function searchOpenverse(query) {
	const api = new URL("https://api.openverse.org/v1/audio/");
	api.searchParams.set("q", query);
	api.searchParams.set("page_size", "40");
	const response = await fetch(api, {
		headers: {
			"User-Agent": UA,
			Accept: "application/json"
		},
		signal: AbortSignal.timeout(12e3)
	});
	if (!response.ok) throw new Error(`Openverse HTTP ${response.status}`);
	const data = await response.json();
	const tracks = [];
	for (const row of data.results || []) {
		if (!row.url || !row.id) continue;
		const durationRaw = Number(row.duration) || 0;
		const duration = durationRaw > 1e3 ? Math.round(durationRaw / 1e3) : Math.round(durationRaw);
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
			thumbnail: row.thumbnail || ""
		});
	}
	return tracks;
}
async function searchMusic(query) {
	const q = query.trim();
	if (!q) return {
		results: [],
		source: "Catalog",
		message: "Missing query"
	};
	const errors = [];
	let jamendo = [];
	let openverse = [];
	if (process.env.JAMENDO_CLIENT_ID) try {
		jamendo = await searchJamendo(q);
	} catch (error) {
		errors.push(error instanceof Error ? error.message : "Jamendo failed");
	}
	try {
		openverse = await searchOpenverse(q);
	} catch (error) {
		errors.push(error instanceof Error ? error.message : "Openverse audio failed");
	}
	const seen = /* @__PURE__ */ new Set();
	const results = [];
	for (const track of [...jamendo, ...openverse]) {
		if (!track.audio || seen.has(track.id)) continue;
		seen.add(track.id);
		results.push(track);
	}
	return {
		results: results.slice(0, 80),
		source: "Jamendo + Openverse",
		message: results.length ? void 0 : errors[0] || "No playable licensed tracks matched this search."
	};
}
var Route = createFileRoute("/api/music-search")({ server: { handlers: { GET: async ({ request }) => {
	const query = new URL(request.url).searchParams.get("q") || "";
	try {
		const body = await searchMusic(query);
		return new Response(JSON.stringify(body), {
			status: 200,
			headers: {
				"content-type": "application/json",
				"cache-control": "no-store"
			}
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Music search failed";
		return new Response(JSON.stringify({
			error: message,
			results: []
		}), {
			status: 502,
			headers: {
				"content-type": "application/json",
				"cache-control": "no-store"
			}
		});
	}
} } } });
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	ApiConvertMp4Route: Route$3.update({
		id: "/api/convert-mp4",
		path: "/api/convert-mp4",
		getParentRoute: () => Route$5
	}),
	ApiMediaProxyRoute: Route$2.update({
		id: "/api/media-proxy",
		path: "/api/media-proxy",
		getParentRoute: () => Route$5
	}),
	ApiMediaSearchRoute: Route$1.update({
		id: "/api/media-search",
		path: "/api/media-search",
		getParentRoute: () => Route$5
	}),
	ApiMusicSearchRoute: Route.update({
		id: "/api/music-search",
		path: "/api/music-search",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter, router_DVMrpFyd_exports as t };
