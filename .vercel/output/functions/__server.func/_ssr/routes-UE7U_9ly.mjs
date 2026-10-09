import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Images, i as LayoutTemplate, o as Clapperboard, r as Music, t as Type } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-UE7U_9ly.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CANVAS_W = 1080;
var CANVAS_H = 1920;
var SAFE = {
	top: 220,
	bottom: 340,
	left: 72,
	right: 72
};
function qcFail(parts) {
	const lines = ["QC FAILED", ""];
	if (parts.scene) lines.push(`Scene: ${parts.scene}`);
	if (parts.template) lines.push(`Template: ${parts.template}`);
	if (parts.asset) lines.push(`Asset: ${parts.asset}`);
	lines.push("", `Reason: ${parts.reason}`, "", `Fix: ${parts.fix}`);
	return lines.join("\n");
}
/** Text that is allowed to be painted on the reel. The studio name is never drawn. */
function reelCopy(text, fallback = "") {
	return (text || "").replace(/festival\s+of\s+bharat/gi, " ").replace(/\s+/g, " ").replace(/^[\s·—\-–|]+|[\s·—\-–|]+$/g, "").trim() || fallback;
}
var PALETTES = {
	gold: {
		name: "Gold Hour",
		bg: "#100e0b",
		fg: "#f6efe4",
		muted: "#d9cbb6",
		accent: "#e0b15a",
		panel: "#1c1812"
	},
	ivory: {
		name: "Ivory Page",
		bg: "#f4efe6",
		fg: "#1c1914",
		muted: "#5e564c",
		accent: "#8a3a32",
		panel: "#fffaf3"
	},
	brass: {
		name: "Temple Brass",
		bg: "#14110c",
		fg: "#f6edd9",
		muted: "#d8c7a4",
		accent: "#c6a15b",
		panel: "#221c14"
	},
	teal: {
		name: "Monsoon",
		bg: "#071416",
		fg: "#e7f4f2",
		muted: "#b7d0cb",
		accent: "#3ec2b0",
		panel: "#102226"
	},
	vermilion: {
		name: "Vermilion",
		bg: "#16090b",
		fg: "#fff1e8",
		muted: "#f0c7b4",
		accent: "#e23b2f",
		panel: "#2a1214"
	},
	charcoal: {
		name: "Charcoal",
		bg: "#0c0c0c",
		fg: "#f3f3f3",
		muted: "#bdbdbd",
		accent: "#ffffff",
		panel: "#161616"
	},
	sandal: {
		name: "Sandal",
		bg: "#f3e6d4",
		fg: "#2a2118",
		muted: "#6b5846",
		accent: "#8d4b2a",
		panel: "#fff6ea"
	},
	indigo: {
		name: "Indigo",
		bg: "#0c1020",
		fg: "#eef1ff",
		muted: "#c5cbe6",
		accent: "#8ea2ff",
		panel: "#161b33"
	},
	marigold: {
		name: "Marigold",
		bg: "#1a1206",
		fg: "#fff6df",
		muted: "#f0d7a4",
		accent: "#f0a202",
		panel: "#2c1e0a"
	},
	slate: {
		name: "Slate",
		bg: "#101418",
		fg: "#eef2f5",
		muted: "#c5ced6",
		accent: "#7f93a6",
		panel: "#1a2128"
	},
	rose: {
		name: "Rose Dusk",
		bg: "#1a1014",
		fg: "#ffeef3",
		muted: "#f0c9d2",
		accent: "#e07a9a",
		panel: "#2a1820"
	},
	forest: {
		name: "Forest",
		bg: "#0d140f",
		fg: "#eef6ee",
		muted: "#c5d6c6",
		accent: "#7dbe74",
		panel: "#172018"
	},
	cream: {
		name: "Cream",
		bg: "#f7f4ef",
		fg: "#171717",
		muted: "#5f5a54",
		accent: "#1f1f1f",
		panel: "#ffffff"
	},
	night: {
		name: "Night Cut",
		bg: "#07080b",
		fg: "#f4efe6",
		muted: "#cfc6b8",
		accent: "#d9c4a4",
		panel: "#12141a"
	},
	copper: {
		name: "Copper",
		bg: "#1a100c",
		fg: "#fff1e6",
		muted: "#e6cbb8",
		accent: "#d4784a",
		panel: "#2a1a14"
	}
};
Object.keys(PALETTES);
function clamp$1(value, min, max) {
	return Math.max(min, Math.min(max, value));
}
function luminance(hex) {
	const raw = hex.replace("#", "");
	if (raw.length < 6) return 0;
	const r = Number.parseInt(raw.slice(0, 2), 16);
	const g = Number.parseInt(raw.slice(2, 4), 16);
	const b = Number.parseInt(raw.slice(4, 6), 16);
	if ([
		r,
		g,
		b
	].some((part) => Number.isNaN(part))) return 0;
	return r * .3 + g * .59 + b * .11;
}
function tintDeco(deco, ink, paper) {
	if (deco.type === "rect") {
		if (deco.h <= 24 || deco.w <= 24) return {
			...deco,
			fill: ink.accent
		};
		if (paper || deco.w > 400) return {
			...deco,
			fill: deco.y < 40 && deco.h < 120 ? ink.accent : ink.panel
		};
		return deco;
	}
	if (deco.type === "frame" || deco.type === "line") return {
		...deco,
		color: ink.accent
	};
	if (deco.type === "letterbox") return {
		...deco,
		color: ink.bg
	};
	if (deco.type === "circle" && deco.r < 24) return {
		...deco,
		color: ink.accent
	};
	return deco;
}
function signature(variant, ink) {
	const mode = variant % 6;
	if (mode === 0) return [{
		layer: "front",
		type: "rect",
		x: 0,
		y: 0,
		w: CANVAS_W,
		h: 12,
		fill: ink.accent
	}];
	if (mode === 1) return [{
		layer: "front",
		type: "rect",
		x: 0,
		y: CANVAS_H - 14,
		w: CANVAS_W,
		h: 14,
		fill: ink.accent
	}];
	if (mode === 2) return [{
		layer: "front",
		type: "rect",
		x: 0,
		y: 0,
		w: 16,
		h: CANVAS_H,
		fill: ink.accent
	}];
	if (mode === 3) return [{
		layer: "front",
		type: "letterbox",
		color: ink.bg,
		size: 86
	}];
	if (mode === 4) return [{
		layer: "front",
		type: "vignette",
		strength: .42
	}];
	return [{
		layer: "front",
		type: "frame",
		x: 28,
		y: 28,
		w: CANVAS_W - 56,
		h: CANVAS_H - 56,
		color: ink.accent,
		width: 3
	}];
}
function paintText(spec, ink, paper, template) {
	const fallback = spec.role === "kicker" ? template.category : "";
	const text = spec.text ? reelCopy(spec.text, fallback) : spec.text;
	const color = spec.role === "kicker" || spec.role === "counter" ? ink.accent : paper ? spec.role === "title" ? ink.fg : ink.muted : spec.color;
	return {
		...spec,
		text,
		color,
		size: Math.max(16, Math.round(spec.size * (.92 + template.variant % 5 * .03)))
	};
}
/** Applies the template's palette, frame, and crop so each reel actually looks different. */
function applyLook(composition, template) {
	const ink = PALETTES[template.palette] ?? PALETTES.night;
	const paper = luminance(composition.bg) > 150;
	const variant = template.variant || 0;
	return {
		bg: ink.bg,
		slots: composition.slots.map((item, index) => {
			const full = item.w > 1e3 && item.h > 1700;
			const inset = full ? 0 : variant % 3 * 8;
			let w = Math.max(140, item.w - inset);
			let h = Math.max(140, item.h - inset);
			let x = item.x + (full ? 0 : (variant + index * 3) % 5 - 2) * 10;
			let y = item.y + (full ? 0 : (variant * 2 + index) % 5 - 2) * 12;
			if (item.polaroid) {
				x = clamp$1(x, 48, CANVAS_W - w - 48);
				y = clamp$1(y, 80, CANVAS_H - h - 160);
			} else {
				x = clamp$1(x, 0, CANVAS_W - w);
				y = clamp$1(y, 0, CANVAS_H - h);
			}
			const radius = item.clip === "arch" || item.clip === "circle" ? item.radius : (item.radius ?? 0) + variant % 4 * 8;
			return {
				...item,
				x,
				y,
				w,
				h,
				radius,
				clip: item.clip === "arch" || item.clip === "circle" ? item.clip : (radius ?? 0) > 10 ? "round" : item.clip,
				focusX: clamp$1((item.focusX ?? .5) + (variant % 7 - 3) * .035, .18, .82),
				focusY: clamp$1((item.focusY ?? .45) + (variant % 5 - 2) * .03, .2, .8),
				mono: Boolean(item.mono || template.palette === "charcoal" && variant % 2 === 0),
				rot: item.rot ? item.rot + (variant % 5 - 2) * .6 : item.rot
			};
		}),
		texts: composition.texts.map((spec) => paintText(spec, ink, paper, template)),
		decos: composition.decos.map((deco) => tintDeco(deco, ink, paper)).concat(signature(variant, ink))
	};
}
var W = CANVAS_W;
var H = CANVAS_H;
var INK = {
	cinema: {
		bg: "#07080b",
		fg: "#f4efe6",
		muted: "#cfc6b8",
		accent: "#d9c4a4",
		panel: "#12141a"
	},
	paper: {
		bg: "#f3eee6",
		fg: "#1b1814",
		muted: "#5c564c",
		accent: "#7d322c",
		panel: "#fffdf9"
	},
	sacred: {
		bg: "#110e0a",
		fg: "#f6edd9",
		muted: "#d8c7a4",
		accent: "#c6a15b",
		panel: "#1b1610"
	},
	news: {
		bg: "#0d1014",
		fg: "#f4f6f8",
		muted: "#c5ccd4",
		accent: "#c41820",
		panel: "#15191e"
	},
	fest: {
		bg: "#160b0e",
		fg: "#fff5e8",
		muted: "#f0d3b4",
		accent: "#e6b15a",
		panel: "#241318"
	},
	mono: {
		bg: "#090909",
		fg: "#f3f3f3",
		muted: "#bdbdbd",
		accent: "#ffffff",
		panel: "#111111"
	},
	cream: {
		bg: "#f7f4ef",
		fg: "#171717",
		muted: "#5f5a54",
		accent: "#171717",
		panel: "#ffffff"
	}
};
function slot(partial) {
	return {
		asset: 0,
		focusX: .5,
		focusY: .45,
		clip: "rect",
		radius: 0,
		scale: 1,
		...partial
	};
}
function title(partial) {
	return {
		role: "title",
		maxW: 900,
		maxH: 220,
		size: 72,
		align: "left",
		weight: 700,
		font: "display",
		maxLines: 3,
		...partial
	};
}
function kicker(text, partial) {
	return {
		role: "kicker",
		text,
		maxW: 800,
		maxH: 40,
		size: 22,
		align: "left",
		weight: 700,
		font: "body",
		maxLines: 1,
		tracking: 4,
		...partial
	};
}
function sub(partial) {
	return {
		role: "sub",
		maxW: 800,
		maxH: 80,
		size: 28,
		align: "left",
		weight: 500,
		font: "body",
		maxLines: 2,
		...partial
	};
}
function gridSlots(n) {
	const m = 48;
	const top = 230;
	const gap = 16;
	if (n <= 1) return [slot({
		x: m,
		y: top,
		w: W - 96,
		h: 1150,
		asset: 0,
		clip: "round",
		radius: 18
	})];
	if (n === 2) {
		const h = 567;
		return [0, 1].map((i) => slot({
			x: m,
			y: top + i * 583,
			w: W - 96,
			h,
			asset: i,
			clip: "round",
			radius: 16,
			focusX: i ? .62 : .38,
			focusY: i ? .6 : .4
		}));
	}
	const colW = (W - 96 - gap) / 2;
	const rowH = 567;
	if (n === 3) return [
		slot({
			x: m,
			y: top,
			w: W - 96,
			h: rowH,
			asset: 0,
			clip: "round",
			radius: 16
		}),
		slot({
			x: m,
			y: 813,
			w: colW,
			h: rowH,
			asset: 1,
			clip: "round",
			radius: 16,
			focusX: .35
		}),
		slot({
			x: m + colW + gap,
			y: 813,
			w: colW,
			h: rowH,
			asset: 2,
			clip: "round",
			radius: 16,
			focusX: .7
		})
	];
	return [
		0,
		1,
		2,
		3
	].map((i) => slot({
		x: m + i % 2 * (colW + gap),
		y: top + Math.floor(i / 2) * 583,
		w: colW,
		h: rowH,
		asset: i,
		clip: "round",
		radius: 14,
		focusX: .32 + i % 3 * .18,
		focusY: .36 + i % 2 * .22
	}));
}
function compose(template, scene) {
	return applyLook(layoutOf(template, scene), template);
}
function layoutOf(template, scene) {
	const n = Math.max(1, scene.assets.length);
	const ink = INK.cinema;
	switch (template.layout) {
		case "dawn": return {
			bg: ink.bg,
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H
			})],
			decos: [{
				layer: "front",
				type: "shade",
				x: 0,
				y: 980,
				w: W,
				h: 940,
				from: "rgba(0,0,0,0)",
				to: "rgba(0,0,0,.78)"
			}, {
				layer: "front",
				type: "letterbox",
				color: "#050506",
				size: 118
			}],
			texts: [
				kicker("CINEMA", {
					x: 80,
					y: 1120,
					color: ink.accent,
					align: "left"
				}),
				title({
					x: 80,
					y: 1170,
					color: ink.fg,
					size: 78,
					maxW: 900,
					maxH: 230
				}),
				sub({
					x: 80,
					y: 1420,
					color: ink.muted,
					maxW: 760
				})
			]
		};
		case "focus": return {
			bg: "#05060a",
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H,
				focusY: .42
			})],
			decos: [{
				layer: "front",
				type: "vignette",
				strength: .78
			}, {
				layer: "front",
				type: "circle",
				cx: 540,
				cy: 820,
				r: 360,
				color: "rgba(244,239,230,.85)",
				width: 2
			}],
			texts: [kicker("FOCUS", {
				x: 540,
				y: 1260,
				color: ink.accent,
				align: "center"
			}), title({
				x: 540,
				y: 1310,
				color: "#f7f3ea",
				size: 68,
				align: "center",
				maxW: 860,
				maxH: 180
			})]
		};
		case "journey": return {
			bg: ink.bg,
			slots: [slot({
				x: 72,
				y: 240,
				w: 936,
				h: 760,
				clip: "round",
				radius: 8,
				focusY: .4
			}), slot({
				x: 72,
				y: 1024,
				w: 936,
				h: 250,
				asset: n > 1 ? 1 : 0,
				clip: "round",
				radius: 8,
				focusY: .78,
				scale: n > 1 ? 1 : 1.45
			})],
			decos: [{
				layer: "front",
				type: "line",
				x1: 72,
				y1: 1004,
				x2: 360,
				y2: 1004,
				color: ink.accent,
				width: 2
			}],
			texts: [kicker("JOURNEY", {
				x: 72,
				y: 1320,
				color: ink.accent
			}), title({
				x: 72,
				y: 1368,
				color: ink.fg,
				size: 60,
				maxW: 920,
				maxH: 150
			})]
		};
		case "meaning": return {
			bg: "#050505",
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H,
				focusY: .4
			})],
			decos: [{
				layer: "front",
				type: "shade",
				x: 0,
				y: 700,
				w: W,
				h: 1220,
				from: "rgba(0,0,0,.05)",
				to: "rgba(0,0,0,.82)"
			}],
			texts: [title({
				x: 540,
				y: 1180,
				color: "#f6f1e8",
				size: 80,
				align: "center",
				maxW: 900,
				maxH: 280,
				maxLines: 4
			})]
		};
		case "split": return {
			bg: "#f6f1e8",
			slots: [slot({
				x: 450,
				y: 0,
				w: 630,
				h: H,
				focusX: .55
			})],
			decos: [{
				layer: "back",
				type: "rect",
				x: 0,
				y: 0,
				w: 450,
				h: H,
				fill: "#f6f1e8"
			}],
			texts: [
				kicker("EDITORIAL", {
					x: 64,
					y: 280,
					color: "#7d322c"
				}),
				title({
					x: 64,
					y: 360,
					color: "#1b1814",
					size: 58,
					maxW: 340,
					maxH: 520,
					maxLines: 6
				}),
				sub({
					x: 64,
					y: 980,
					color: "#5c564c",
					maxW: 340,
					maxH: 120
				}),
				{
					role: "counter",
					x: 64,
					y: 1280,
					color: "#1b1814",
					maxW: 200,
					maxH: 80,
					size: 42,
					align: "left",
					weight: 700,
					font: "body",
					maxLines: 1
				}
			]
		};
		case "column": return {
			bg: "#f3eee6",
			slots: [slot({
				x: 390,
				y: 220,
				w: 620,
				h: 1320,
				clip: "rect"
			})],
			decos: [{
				layer: "front",
				type: "line",
				x1: 80,
				y1: 250,
				x2: 80,
				y2: 1480,
				color: "#7d322c",
				width: 3
			}],
			texts: [
				kicker("COLUMN", {
					x: 108,
					y: 260,
					color: "#7d322c",
					maxW: 250
				}),
				title({
					x: 108,
					y: 330,
					color: "#1b1814",
					size: 52,
					maxW: 250,
					maxH: 760,
					maxLines: 8
				}),
				sub({
					x: 108,
					y: 1160,
					color: "#5c564c",
					maxW: 250,
					size: 22
				})
			]
		};
		case "eframe": return {
			bg: "#f7f4ef",
			slots: [slot({
				x: 120,
				y: 250,
				w: 840,
				h: 980
			})],
			decos: [{
				layer: "front",
				type: "frame",
				x: 96,
				y: 226,
				w: 888,
				h: 1028,
				color: "#1b1814",
				width: 2
			}, {
				layer: "front",
				type: "frame",
				x: 78,
				y: 208,
				w: 924,
				h: 1064,
				color: "#1b1814",
				width: 1
			}],
			texts: [kicker("FRAME", {
				x: 120,
				y: 1320,
				color: "#7d322c"
			}), title({
				x: 120,
				y: 1368,
				color: "#1b1814",
				size: 52,
				maxW: 840,
				maxH: 140
			})]
		};
		case "estory": return {
			bg: "#f4efe6",
			slots: [slot({
				x: 72,
				y: 220,
				w: 936,
				h: 640
			})],
			decos: [{
				layer: "front",
				type: "line",
				x1: 72,
				y1: 900,
				x2: 280,
				y2: 900,
				color: "#7d322c",
				width: 2
			}],
			texts: [
				kicker("STORY", {
					x: 72,
					y: 930,
					color: "#7d322c"
				}),
				title({
					x: 72,
					y: 980,
					color: "#1b1814",
					size: 64,
					maxW: 920,
					maxH: 200
				}),
				sub({
					x: 72,
					y: 1220,
					color: "#5c564c",
					maxW: 860,
					maxH: 120,
					maxLines: 3
				}),
				{
					role: "meta",
					text: "FIELD NOTE",
					x: 72,
					y: 1420,
					color: "#1b1814",
					maxW: 700,
					maxH: 36,
					size: 18,
					align: "left",
					weight: 700,
					font: "body",
					maxLines: 1,
					tracking: 3
				}
			]
		};
		case "cover": return {
			bg: "#101114",
			slots: [slot({
				x: 0,
				y: 300,
				w: W,
				h: 980
			})],
			decos: [{
				layer: "back",
				type: "rect",
				x: 0,
				y: 0,
				w: W,
				h: H,
				fill: "#101114"
			}, {
				layer: "front",
				type: "shade",
				x: 0,
				y: 980,
				w: W,
				h: 420,
				from: "rgba(0,0,0,0)",
				to: "rgba(0,0,0,.55)"
			}],
			texts: [
				kicker("COVER", {
					x: 540,
					y: 236,
					color: "#f4efe6",
					align: "center",
					maxW: 900,
					size: 24
				}),
				title({
					x: 72,
					y: 1180,
					color: "#f4efe6",
					size: 86,
					maxW: 940,
					maxH: 220
				}),
				sub({
					x: 72,
					y: 1420,
					color: "#d9c4a4",
					maxW: 800
				})
			]
		};
		case "feature": return {
			bg: "#f6f1e8",
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: 860
			})],
			decos: [{
				layer: "front",
				type: "line",
				x1: 72,
				y1: 900,
				x2: 240,
				y2: 900,
				color: "#7d322c",
				width: 3
			}],
			texts: [
				kicker("FEATURE", {
					x: 72,
					y: 930,
					color: "#7d322c"
				}),
				title({
					x: 72,
					y: 990,
					color: "#1b1814",
					size: 64,
					maxW: 920,
					maxH: 210
				}),
				sub({
					x: 72,
					y: 1240,
					color: "#5c564c",
					maxW: 860,
					maxLines: 3,
					maxH: 140
				})
			]
		};
		case "mbold": return {
			bg: "#0c0d10",
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H,
				focusX: .72
			})],
			decos: [{
				layer: "front",
				type: "shade",
				x: 0,
				y: 0,
				w: 760,
				h: H,
				from: "rgba(8,8,10,.88)",
				to: "rgba(8,8,10,.15)"
			}],
			texts: [kicker("BOLD", {
				x: 72,
				y: 520,
				color: "#d9c4a4"
			}), title({
				x: 72,
				y: 580,
				color: "#f7f3ea",
				size: 92,
				maxW: 620,
				maxH: 640,
				maxLines: 5
			})]
		};
		case "polaroid": {
			const slots = [];
			if (n > 1) slots.push(slot({
				x: 170,
				y: 280,
				w: 700,
				h: 820,
				asset: 1,
				rot: -7,
				shadow: true,
				focusY: .4
			}));
			slots.push(slot({
				x: 210,
				y: 390,
				w: 680,
				h: 760,
				asset: 0,
				rot: 4,
				polaroid: true,
				caption: true,
				shadow: true
			}));
			return {
				bg: "#c9c0b4",
				slots,
				decos: [],
				texts: [kicker("MEMORY", {
					x: 540,
					y: 1460,
					color: "#2a241c",
					align: "center"
				})]
			};
		}
		case "diary": return {
			bg: "#efe4d2",
			slots: [slot({
				x: 150,
				y: 300,
				w: 780,
				h: 860,
				shadow: true
			})],
			decos: [{
				layer: "front",
				type: "rect",
				x: 430,
				y: 270,
				w: 180,
				h: 36,
				fill: "rgba(196,168,120,.85)"
			}, {
				layer: "front",
				type: "line",
				x1: 160,
				y1: 1220,
				x2: 900,
				y2: 1220,
				color: "rgba(60,40,20,.25)",
				width: 1
			}],
			texts: [kicker("DIARY", {
				x: 150,
				y: 1280,
				color: "#7d322c"
			}), title({
				x: 150,
				y: 1330,
				color: "#2a2118",
				size: 48,
				maxW: 780,
				maxH: 140,
				italic: true
			})]
		};
		case "scrapbook": return {
			bg: "#e7dcc8",
			slots: [
				{
					x: 120,
					y: 250,
					w: 640,
					h: 760,
					rot: -6
				},
				{
					x: 400,
					y: 560,
					w: 560,
					h: 680,
					rot: 5
				},
				{
					x: 140,
					y: 980,
					w: 480,
					h: 360,
					rot: -2
				}
			].slice(0, n).map((place, index) => slot({
				...place,
				asset: index,
				polaroid: true,
				shadow: true
			})),
			decos: [],
			texts: [kicker("SCRAPBOOK", {
				x: 72,
				y: 230,
				color: "#3a3128",
				size: 18
			})]
		};
		case "grid": return {
			bg: "#101114",
			slots: gridSlots(n),
			decos: [],
			texts: [kicker("COLLAGE", {
				x: 48,
				y: 1420,
				color: "#d9c4a4"
			}), title({
				x: 48,
				y: 1460,
				color: "#f4efe6",
				size: 40,
				maxW: 980,
				maxH: 80,
				maxLines: 2
			})]
		};
		case "dgrid": {
			const top = 220;
			return {
				bg: "#12141a",
				slots: n === 1 ? [slot({
					x: 48,
					y: top,
					w: W - 96,
					h: 1160,
					clip: "round",
					radius: 12
				})] : n === 2 ? [slot({
					x: 48,
					y: top,
					w: 560,
					h: 1160,
					clip: "round",
					radius: 12
				}), slot({
					x: 622,
					y: top,
					w: 410,
					h: 1160,
					asset: 1,
					clip: "round",
					radius: 12,
					focusX: .6
				})] : [
					slot({
						x: 48,
						y: top,
						w: 620,
						h: 1160,
						clip: "round",
						radius: 12
					}),
					slot({
						x: 682,
						y: top,
						w: 350,
						h: 573,
						asset: 1,
						clip: "round",
						radius: 12,
						focusY: .35
					}),
					slot({
						x: 682,
						y: 807,
						w: 350,
						h: 573,
						asset: 2,
						clip: "round",
						radius: 12,
						focusY: .7
					})
				],
				decos: [],
				texts: [title({
					x: 48,
					y: 1420,
					color: "#f4efe6",
					size: 42,
					maxW: 980,
					maxH: 90,
					maxLines: 2
				})]
			};
		}
		case "wall": return {
			bg: "#1a1714",
			slots: [
				{
					x: 60,
					y: 230,
					w: 680,
					h: 860,
					rot: -3
				},
				{
					x: 430,
					y: 480,
					w: 580,
					h: 720,
					rot: 4
				},
				{
					x: 80,
					y: 980,
					w: 500,
					h: 380,
					rot: -2
				},
				{
					x: 540,
					y: 1080,
					w: 460,
					h: 300,
					rot: 3
				}
			].slice(0, n).map((place, index) => slot({
				...place,
				asset: index,
				shadow: true
			})),
			decos: [{
				layer: "front",
				type: "shade",
				x: 0,
				y: 1320,
				w: W,
				h: 280,
				from: "rgba(16,12,10,0)",
				to: "rgba(16,12,10,.92)"
			}],
			texts: [title({
				x: 72,
				y: 1420,
				color: "#f6f1e8",
				size: 48,
				maxW: 920,
				maxH: 110
			})]
		};
		case "mframe": {
			const slots = n === 1 ? [slot({
				x: 64,
				y: 220,
				w: 952,
				h: 1180
			})] : n === 2 ? [slot({
				x: 64,
				y: 220,
				w: 952,
				h: 760
			}), slot({
				x: 64,
				y: 1e3,
				w: 952,
				h: 380,
				asset: 1,
				focusY: .7
			})] : [
				slot({
					x: 64,
					y: 220,
					w: 952,
					h: 720
				}),
				slot({
					x: 64,
					y: 960,
					w: 466,
					h: 400,
					asset: 1,
					focusX: .4
				}),
				slot({
					x: 550,
					y: 960,
					w: 466,
					h: 400,
					asset: 2,
					focusX: .65
				})
			];
			return {
				bg: "#f3eee6",
				slots,
				decos: slots.map((item) => ({
					layer: "front",
					type: "frame",
					x: item.x - 8,
					y: item.y - 8,
					w: item.w + 16,
					h: item.h + 16,
					color: "#1b1814",
					width: 2
				})),
				texts: [title({
					x: 64,
					y: 1420,
					color: "#1b1814",
					size: 46,
					maxW: 940,
					maxH: 100
				})]
			};
		}
		case "sacred": return {
			bg: INK.sacred.bg,
			slots: [slot({
				x: 150,
				y: 240,
				w: 780,
				h: 1040,
				clip: "arch"
			})],
			decos: [{
				layer: "front",
				type: "frame",
				x: 132,
				y: 220,
				w: 816,
				h: 1080,
				color: INK.sacred.accent,
				width: 2
			}],
			texts: [title({
				x: 540,
				y: 1360,
				color: INK.sacred.fg,
				align: "center",
				size: 54,
				maxW: 860,
				maxH: 120
			}), sub({
				x: 540,
				y: 1490,
				color: INK.sacred.muted,
				align: "center",
				maxW: 760,
				size: 24
			})]
		};
		case "temple": return {
			bg: "#140e09",
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H,
				focusY: .35
			})],
			decos: [
				{
					layer: "front",
					type: "shade",
					x: 180,
					y: 0,
					w: 720,
					h: 640,
					from: "rgba(230,190,120,.28)",
					to: "rgba(230,190,120,0)"
				},
				{
					layer: "front",
					type: "shade",
					x: 0,
					y: 1100,
					w: W,
					h: 820,
					from: "rgba(0,0,0,0)",
					to: "rgba(0,0,0,.8)"
				},
				{
					layer: "front",
					type: "line",
					x1: 390,
					y1: 1320,
					x2: 690,
					y2: 1320,
					color: "#c6a15b",
					width: 1
				}
			],
			texts: [kicker("TEMPLE", {
				x: 540,
				y: 1340,
				color: "#c6a15b",
				align: "center"
			}), title({
				x: 540,
				y: 1390,
				color: "#f6edd9",
				align: "center",
				size: 60,
				maxW: 880,
				maxH: 140
			})]
		};
		case "devotional": return {
			bg: INK.sacred.bg,
			slots: [slot({
				x: 250,
				y: 280,
				w: 580,
				h: 980,
				clip: "round",
				radius: 40
			})],
			decos: [{
				layer: "front",
				type: "frame",
				x: 230,
				y: 260,
				w: 620,
				h: 1020,
				color: INK.sacred.accent,
				width: 1
			}],
			texts: [kicker("DEVOTION", {
				x: 540,
				y: 1320,
				color: INK.sacred.accent,
				align: "center"
			}), title({
				x: 540,
				y: 1370,
				color: INK.sacred.fg,
				align: "center",
				size: 46,
				maxW: 860,
				maxH: 140
			})]
		};
		case "energy": return {
			bg: INK.fest.bg,
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H
			})],
			decos: [{
				layer: "front",
				type: "rect",
				x: 0,
				y: 220,
				w: W,
				h: 14,
				fill: INK.fest.accent
			}, {
				layer: "front",
				type: "shade",
				x: 0,
				y: 1e3,
				w: W,
				h: 920,
				from: "rgba(0,0,0,0)",
				to: "rgba(12,4,6,.88)"
			}],
			texts: [{
				role: "counter",
				x: 72,
				y: 1100,
				color: INK.fest.accent,
				maxW: 300,
				maxH: 70,
				size: 48,
				align: "left",
				weight: 700,
				font: "body",
				maxLines: 1
			}, title({
				x: 72,
				y: 1180,
				color: INK.fest.fg,
				size: 84,
				maxW: 940,
				maxH: 240,
				maxLines: 3
			})]
		};
		case "burst": return {
			bg: "#1a0c10",
			slots: [slot({
				x: 70,
				y: 250,
				w: 940,
				h: 980,
				rot: -7,
				shadow: true
			})],
			decos: [{
				layer: "back",
				type: "rect",
				x: 620,
				y: 180,
				w: 520,
				h: 1500,
				fill: "#3a1820"
			}],
			texts: [kicker("FESTIVAL", {
				x: 72,
				y: 1280,
				color: INK.fest.accent
			}), title({
				x: 72,
				y: 1330,
				color: "#fff5e8",
				size: 72,
				maxW: 940,
				maxH: 180
			})]
		};
		case "crowd": return {
			bg: "#070707",
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H,
				scale: 1.18,
				focusY: .48
			})],
			decos: [{
				layer: "front",
				type: "shade",
				x: 0,
				y: 1280,
				w: W,
				h: 640,
				from: "rgba(0,0,0,0)",
				to: "rgba(0,0,0,.75)"
			}],
			texts: [title({
				x: 72,
				y: 1420,
				color: "#f4efe6",
				size: 54,
				maxW: 920,
				maxH: 100,
				maxLines: 2
			})]
		};
		case "doc": return {
			bg: "#141210",
			slots: [slot({
				x: 86,
				y: 230,
				w: 908,
				h: 900
			})],
			decos: [{
				layer: "front",
				type: "sprockets"
			}, {
				layer: "front",
				type: "frame",
				x: 70,
				y: 214,
				w: 940,
				h: 932,
				color: "#d9d0c3",
				width: 1
			}],
			texts: [
				kicker("DOCUMENTARY", {
					x: 86,
					y: 1180,
					color: "#d9c4a4"
				}),
				title({
					x: 86,
					y: 1230,
					color: "#f4efe6",
					size: 52,
					maxW: 900,
					maxH: 160
				}),
				{
					role: "meta",
					text: "FIELD RECORD",
					x: 86,
					y: 1440,
					color: "#cfc6b8",
					maxW: 700,
					maxH: 36,
					size: 18,
					align: "left",
					weight: 700,
					font: "body",
					maxLines: 1,
					tracking: 3
				}
			]
		};
		case "timeline": return {
			bg: "#f3eee6",
			slots: [slot({
				x: 180,
				y: 250,
				w: 840,
				h: 900
			})],
			decos: [
				{
					layer: "front",
					type: "line",
					x1: 96,
					y1: 240,
					x2: 96,
					y2: 1500,
					color: "#7d322c",
					width: 2
				},
				{
					layer: "front",
					type: "circle",
					cx: 96,
					cy: 360,
					r: 7,
					color: "#7d322c",
					width: 8
				},
				{
					layer: "front",
					type: "circle",
					cx: 96,
					cy: 980,
					r: 7,
					color: "#7d322c",
					width: 8
				}
			],
			texts: [{
				role: "counter",
				x: 140,
				y: 1220,
				color: "#7d322c",
				maxW: 200,
				maxH: 60,
				size: 36,
				align: "left",
				weight: 700,
				font: "body",
				maxLines: 1
			}, title({
				x: 140,
				y: 1280,
				color: "#1b1814",
				size: 48,
				maxW: 860,
				maxH: 160
			})]
		};
		case "journal": return {
			bg: "#f6f1e8",
			slots: [slot({
				x: 360,
				y: 230,
				w: 660,
				h: 1240
			})],
			decos: [{
				layer: "front",
				type: "line",
				x1: 330,
				y1: 240,
				x2: 330,
				y2: 1480,
				color: "rgba(80,60,40,.35)",
				width: 1
			}],
			texts: [
				kicker("NOTES", {
					x: 56,
					y: 260,
					color: "#7d322c",
					maxW: 250
				}),
				title({
					x: 56,
					y: 340,
					color: "#1b1814",
					size: 40,
					maxW: 250,
					maxH: 640,
					maxLines: 8
				}),
				sub({
					x: 56,
					y: 1100,
					color: "#5c564c",
					maxW: 250,
					size: 20,
					maxH: 160
				})
			]
		};
		case "hframe": return {
			bg: "#16110c",
			slots: [slot({
				x: 140,
				y: 270,
				w: 800,
				h: 980
			})],
			decos: [{
				layer: "front",
				type: "frame",
				x: 110,
				y: 240,
				w: 860,
				h: 1040,
				color: "#c6a15b",
				width: 2
			}, {
				layer: "front",
				type: "frame",
				x: 92,
				y: 222,
				w: 896,
				h: 1076,
				color: "#c6a15b",
				width: 1
			}],
			texts: [kicker("HERITAGE", {
				x: 540,
				y: 1360,
				color: "#c6a15b",
				align: "center"
			}), title({
				x: 540,
				y: 1410,
				color: "#f6edd9",
				align: "center",
				size: 46,
				maxW: 860,
				maxH: 110
			})]
		};
		case "minimal": return {
			bg: "#f7f4ef",
			slots: [slot({
				x: 140,
				y: 400,
				w: 800,
				h: 860
			})],
			decos: [],
			texts: [kicker("NOTE", {
				x: 140,
				y: 280,
				color: "#7a756c",
				size: 16
			}), title({
				x: 140,
				y: 1320,
				color: "#171717",
				size: 46,
				maxW: 800,
				maxH: 140
			})]
		};
		case "quote": return {
			bg: "#0c0c0c",
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H
			})],
			decos: [{
				layer: "front",
				type: "shade",
				x: 0,
				y: 0,
				w: W,
				h: H,
				from: "rgba(0,0,0,.55)",
				to: "rgba(0,0,0,.72)"
			}],
			texts: [{
				role: "kicker",
				text: "“",
				x: 100,
				y: 640,
				color: "rgba(255,255,255,.85)",
				maxW: 200,
				maxH: 120,
				size: 100,
				align: "left",
				weight: 500,
				font: "display",
				maxLines: 1
			}, title({
				x: 540,
				y: 820,
				color: "#f7f4ef",
				align: "center",
				size: 60,
				maxW: 840,
				maxH: 360,
				maxLines: 5
			})]
		};
		case "mono": return {
			bg: "#050505",
			slots: [slot({
				x: 0,
				y: 0,
				w: 700,
				h: H,
				mono: true
			})],
			decos: [{
				layer: "back",
				type: "rect",
				x: 700,
				y: 0,
				w: 380,
				h: H,
				fill: "#050505"
			}],
			texts: [title({
				x: 890,
				y: 980,
				color: "#f5f5f5",
				size: 54,
				maxW: 980,
				maxH: 140,
				align: "center",
				rotate: -90,
				maxLines: 2
			})]
		};
		case "kinetic": return {
			bg: "#0e1014",
			slots: [slot({
				x: 0,
				y: 860,
				w: W,
				h: 1060
			})],
			decos: [{
				layer: "back",
				type: "rect",
				x: 0,
				y: 0,
				w: W,
				h: 860,
				fill: "#0e1014"
			}],
			texts: [kicker("CAPTION", {
				x: 72,
				y: 250,
				color: "#d9c4a4"
			}), title({
				x: 72,
				y: 320,
				color: "#f4efe6",
				size: 92,
				maxW: 940,
				maxH: 420,
				maxLines: 4,
				motion: "slide"
			})]
		};
		case "dcrop":
			if (scene.index % 2 === 0) return {
				bg: "#07080b",
				slots: [slot({
					x: 0,
					y: 250,
					w: W,
					h: 860,
					scale: 1.22,
					focusY: .38 + scene.index % 3 * .06
				})],
				decos: [{
					layer: "back",
					type: "rect",
					x: 0,
					y: 0,
					w: W,
					h: H,
					fill: "#07080b"
				}],
				texts: [kicker("WIDE CROP", {
					x: 72,
					y: 1180,
					color: "#d9c4a4"
				}), title({
					x: 72,
					y: 1230,
					color: "#f4efe6",
					size: 64,
					maxW: 920,
					maxH: 200
				})]
			};
			return {
				bg: "#07080b",
				slots: [slot({
					x: 160,
					y: 220,
					w: 760,
					h: 1180,
					scale: 1.3,
					focusX: scene.index % 3 === 0 ? .32 : .7
				})],
				decos: [{
					layer: "back",
					type: "rect",
					x: 0,
					y: 0,
					w: W,
					h: H,
					fill: "#07080b"
				}],
				texts: [kicker("TIGHT CROP", {
					x: 72,
					y: 1430,
					color: "#d9c4a4"
				}), title({
					x: 72,
					y: 1472,
					color: "#f4efe6",
					size: 36,
					maxW: 920,
					maxH: 70,
					maxLines: 2
				})]
			};
		case "news": return {
			bg: INK.news.bg,
			slots: [slot({
				x: 0,
				y: 310,
				w: W,
				h: 820
			})],
			decos: [{
				layer: "front",
				type: "rect",
				x: 0,
				y: 220,
				w: W,
				h: 78,
				fill: INK.news.accent
			}, {
				layer: "back",
				type: "rect",
				x: 0,
				y: 1140,
				w: W,
				h: 280,
				fill: "#0a0c0f"
			}],
			texts: [
				kicker("CULTURE DESK", {
					x: 28,
					y: 242,
					color: "#ffffff",
					maxW: 700,
					size: 26
				}),
				title({
					x: 36,
					y: 1180,
					color: "#f4f6f8",
					size: 52,
					maxW: 1e3,
					maxH: 170
				}),
				sub({
					x: 36,
					y: 1440,
					color: "#c5ccd4",
					maxW: 980,
					size: 24
				})
			]
		};
		case "vlabel": return {
			bg: "#07080b",
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H,
				focusX: .58
			})],
			decos: [{
				layer: "front",
				type: "shade",
				x: 0,
				y: 0,
				w: 280,
				h: H,
				from: "rgba(0,0,0,.78)",
				to: "rgba(0,0,0,0)"
			}],
			texts: [title({
				x: 150,
				y: 1040,
				color: "#f4efe6",
				size: 48,
				maxW: 1100,
				maxH: 120,
				align: "center",
				rotate: -90,
				maxLines: 2
			})]
		};
		case "sacredoc": return {
			bg: INK.sacred.bg,
			slots: [slot({
				x: 150,
				y: 230,
				w: 780,
				h: 920,
				clip: "arch"
			})],
			decos: [{
				layer: "front",
				type: "frame",
				x: 132,
				y: 210,
				w: 816,
				h: 960,
				color: INK.sacred.accent,
				width: 2
			}, {
				layer: "front",
				type: "rect",
				x: 96,
				y: 1240,
				w: 888,
				h: 250,
				fill: "#f3eee6"
			}],
			texts: [kicker("RECORD", {
				x: 130,
				y: 1270,
				color: "#7d322c"
			}), title({
				x: 130,
				y: 1320,
				color: "#1b1814",
				size: 40,
				maxW: 820,
				maxH: 130
			})]
		};
		case "cards": return {
			bg: "#1a120e",
			slots: [slot({
				x: 130,
				y: 300,
				w: 820,
				h: 760
			})],
			decos: [{
				layer: "back",
				type: "rect",
				x: 80,
				y: 230,
				w: 920,
				h: 1280,
				fill: "#f6f1e8"
			}],
			texts: [
				kicker("CARD", {
					x: 130,
					y: 1100,
					color: "#7d322c"
				}),
				title({
					x: 130,
					y: 1150,
					color: "#1b1814",
					size: 52,
					maxW: 820,
					maxH: 180
				}),
				sub({
					x: 130,
					y: 1360,
					color: "#5c564c",
					maxW: 760
				})
			]
		};
		case "finale": return {
			bg: "#070707",
			slots: [slot({
				x: 140,
				y: 280,
				w: 800,
				h: 700
			})],
			decos: [{
				layer: "front",
				type: "line",
				x1: 360,
				y1: 1040,
				x2: 720,
				y2: 1040,
				color: "#d9c4a4",
				width: 1
			}],
			texts: [title({
				x: 540,
				y: 1100,
				color: "#f4efe6",
				align: "center",
				size: 78,
				maxW: 920,
				maxH: 240,
				maxLines: 3
			}), kicker("CLOSE", {
				x: 540,
				y: 1420,
				color: "#d9c4a4",
				align: "center",
				maxW: 800
			})]
		};
		default: return {
			bg: ink.bg,
			slots: [slot({
				x: 0,
				y: 0,
				w: W,
				h: H
			})],
			decos: [],
			texts: [title({
				x: 80,
				y: 1300,
				color: ink.fg
			})]
		};
	}
}
var MULTI = {
	journey: 2,
	polaroid: 2,
	scrapbook: 3,
	grid: 4,
	dgrid: 3,
	wall: 4,
	mframe: 3
};
function desiredSlots(template) {
	return MULTI[template.layout] ?? 1;
}
function demoAssets(count) {
	return Array.from({ length: Math.max(1, count) }, (_, index) => ({
		id: `demo-${index + 1}`,
		title: `Demo ${index + 1}`,
		source: "Demo",
		kind: "image",
		url: "",
		thumb: "",
		playUrl: "",
		demo: true
	}));
}
function durationFor(template, speed) {
	const mult = speed === "slow" ? 1.2 : speed === "fast" ? .75 : 1;
	return Math.max(8, Math.round(template.duration * mult));
}
function buildScenes(template, selected) {
	if (!selected.length) return [];
	const want = desiredSlots(template);
	const sceneCount = Math.max(template.beats.length, selected.length);
	const scenes = [];
	for (let index = 0; index < sceneCount; index++) {
		const beat = template.beats[index % template.beats.length];
		const count = Math.min(want, selected.length);
		const assets = [];
		for (let k = 0; k < count; k++) {
			const asset = selected[(index + k) % selected.length];
			if (asset) assets.push(asset);
		}
		scenes.push({
			index,
			role: beat.role,
			label: beat.label,
			assets
		});
	}
	return scenes;
}
function coversSelection(scenes, selected) {
	const seen = /* @__PURE__ */ new Set();
	for (const scene of scenes) for (const asset of scene.assets) seen.add(asset.id);
	return selected.every((asset) => seen.has(asset.id));
}
function sceneDurations(total, count) {
	if (count <= 0) return [];
	const each = Math.max(.4, total) / count;
	return Array.from({ length: count }, () => each);
}
function transitionSeconds(id, speed, sceneIndex) {
	const base = id === "hard" ? .07 : id === "flash" || id === "film-cut" ? .2 : id === "fade" || id === "crossfade" ? .5 : .36;
	const mult = speed === "slow" ? 1.3 : speed === "fast" ? .55 : speed === "mixed" ? sceneIndex % 2 === 0 ? 1.2 : .62 : 1;
	return Math.min(1.05, base * mult);
}
function locate(time, durations, transFor) {
	const total = durations.reduce((sum, value) => sum + value, 0);
	const t = Math.max(0, Math.min(time, Math.max(0, total - 1e-4)));
	let acc = 0;
	for (let i = 0; i < durations.length; i++) {
		const d = durations[i] ?? 0;
		if (t < acc + d || i === durations.length - 1) {
			const local = Math.min(d, Math.max(0, t - acc));
			const u = d <= 0 ? 1 : local / d;
			const remain = d - local;
			const trans = i < durations.length - 1 ? Math.min(transFor(i), d * .46) : 0;
			const blend = trans > 0 && remain < trans ? 1 - remain / trans : 0;
			return {
				index: i,
				local,
				u,
				blend,
				next: Math.min(durations.length - 1, i + 1),
				duration: d
			};
		}
		acc += d;
	}
	const last = Math.max(0, durations.length - 1);
	return {
		index: last,
		local: 0,
		u: 1,
		blend: 0,
		next: last,
		duration: durations[last] ?? 0
	};
}
var PLATES = [
	"#2c241c|#8a6232|#e4c48a",
	"#151a22|#3c4c63|#d5dbe6",
	"#2a1416|#7a3834|#e2b48e",
	"#1c1914|#5a5146|#d9d0c2"
];
function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}
function sourceSize(src) {
	if (src instanceof HTMLVideoElement) return {
		w: src.videoWidth,
		h: src.videoHeight
	};
	if (src instanceof HTMLImageElement) return {
		w: src.naturalWidth,
		h: src.naturalHeight
	};
	if (src instanceof HTMLCanvasElement) return {
		w: src.width,
		h: src.height
	};
	if (typeof ImageBitmap !== "undefined" && src instanceof ImageBitmap) return {
		w: src.width,
		h: src.height
	};
	const box = src;
	return {
		w: box.videoWidth || box.width || 0,
		h: box.videoHeight || box.height || 0
	};
}
function roundPath(ctx, x, y, w, h, r) {
	const radius = Math.max(0, Math.min(r, w / 2, h / 2));
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + w, y, x + w, y + h, radius);
	ctx.arcTo(x + w, y + h, x, y + h, radius);
	ctx.arcTo(x, y + h, x, y, radius);
	ctx.arcTo(x, y, x + w, y, radius);
	ctx.closePath();
}
function clipSlot(ctx, slot) {
	ctx.beginPath();
	if (slot.clip === "circle") ctx.arc(slot.x + slot.w / 2, slot.y + slot.h / 2, Math.min(slot.w, slot.h) / 2, 0, Math.PI * 2);
	else if (slot.clip === "arch") {
		ctx.moveTo(slot.x, slot.y + slot.h);
		ctx.lineTo(slot.x, slot.y + slot.h * .4);
		ctx.bezierCurveTo(slot.x, slot.y, slot.x + slot.w, slot.y, slot.x + slot.w, slot.y + slot.h * .4);
		ctx.lineTo(slot.x + slot.w, slot.y + slot.h);
		ctx.closePath();
	} else if (slot.clip === "round" || (slot.radius ?? 0) > 0) roundPath(ctx, slot.x, slot.y, slot.w, slot.h, slot.radius ?? 16);
	else ctx.rect(slot.x, slot.y, slot.w, slot.h);
}
function cover(ctx, src, dx, dy, dw, dh, focusX, focusY, scale) {
	const { w: sw, h: sh } = sourceSize(src);
	if (sw < 2 || sh < 2 || dw < 2 || dh < 2) return false;
	const safeScale = Math.max(1, scale);
	const destAspect = dw / dh;
	const srcAspect = sw / sh;
	let sWidth;
	let sHeight;
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
function drawPlate(ctx, slot, seed) {
	const tone = (PLATES[Math.abs(seed) % PLATES.length] ?? PLATES[0]).split("|");
	const gradient = ctx.createLinearGradient(slot.x, slot.y, slot.x + slot.w, slot.y + slot.h);
	gradient.addColorStop(0, tone[0] || "#2c241c");
	gradient.addColorStop(.55, tone[1] || "#8a6232");
	gradient.addColorStop(1, tone[2] || "#e4c48a");
	ctx.fillStyle = gradient;
	ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
	ctx.fillStyle = "rgba(0,0,0,.28)";
	ctx.fillRect(slot.x + slot.w * .18, slot.y + slot.h * .28, slot.w * .42, slot.h * .5);
	ctx.fillStyle = "rgba(255,244,220,.75)";
	ctx.beginPath();
	ctx.arc(slot.x + slot.w * .72, slot.y + slot.h * .26, Math.min(slot.w, slot.h) * .07, 0, Math.PI * 2);
	ctx.fill();
}
function motionShift(motion, u, speed, sceneIndex, slotIndex) {
	const amp = speed === "slow" ? .55 : speed === "fast" ? 1.5 : speed === "mixed" ? sceneIndex % 2 ? 1.45 : .6 : 1;
	const uu = clamp(u, 0, 1);
	switch (motion) {
		case "slow-push": return {
			scale: 1 + .1 * amp * uu,
			x: 0,
			y: 0
		};
		case "slow-pull": return {
			scale: 1 + .12 * amp * (1 - uu),
			x: 0,
			y: 0
		};
		case "pan-left": return {
			scale: 1 + .16 * amp,
			x: .14 * amp * (.5 - uu),
			y: 0
		};
		case "pan-right": return {
			scale: 1 + .16 * amp,
			x: .14 * amp * (uu - .5),
			y: 0
		};
		case "pan-up": return {
			scale: 1 + .14 * amp,
			x: 0,
			y: .1 * amp * (.5 - uu)
		};
		case "reveal": return {
			scale: 1 + .08 * amp * uu,
			x: 0,
			y: .04 * amp * (1 - uu)
		};
		case "diagonal": return {
			scale: 1 + .12 * amp,
			x: .08 * amp * (uu - .5),
			y: .06 * amp * (.5 - uu)
		};
		case "crop-punch": return {
			scale: 1.04 + .26 * amp * (1 - uu),
			x: .04 * Math.sin((uu + slotIndex) * Math.PI),
			y: 0
		};
		case "drift": return {
			scale: 1.06,
			x: .045 * amp * Math.sin((uu + slotIndex * .2) * Math.PI),
			y: .03 * amp * Math.cos((uu + slotIndex * .2) * Math.PI)
		};
		default: return {
			scale: 1.04,
			x: 0,
			y: 0
		};
	}
}
function scriptFamily(text, chosen, role) {
	if (/[\u0900-\u097F]/.test(text)) return "\"Noto Sans Devanagari\", sans-serif";
	if (/[\u0A80-\u0AFF]/.test(text)) return "\"Noto Sans Gujarati\", sans-serif";
	if (/[\u0B80-\u0BFF]/.test(text)) return "\"Noto Sans Tamil\", sans-serif";
	if (/[\u0C00-\u0C7F]/.test(text)) return "\"Noto Sans Telugu\", sans-serif";
	if (/[\u0980-\u09FF]/.test(text)) return "\"Noto Sans Bengali\", sans-serif";
	if (/[\u0C80-\u0CFF]/.test(text)) return "\"Noto Sans Kannada\", sans-serif";
	if (/[\u0D00-\u0D7F]/.test(text)) return "\"Noto Sans Malayalam\", sans-serif";
	if (/[\u0A00-\u0A7F]/.test(text)) return "\"Noto Sans Gurmukhi\", sans-serif";
	if (chosen && chosen !== "Auto") return `"${chosen}", sans-serif`;
	return role === "display" ? "\"Playfair Display\", Georgia, serif" : "\"DM Sans\", sans-serif";
}
function wrapLines(ctx, text, maxW) {
	const words = text.trim().split(/\s+/).filter(Boolean);
	if (!words.length) return [];
	const lines = [];
	let current = "";
	const pushWord = (word) => {
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
function ellipsize(ctx, line, maxW) {
	if (ctx.measureText(line).width <= maxW) return line;
	let value = line;
	while (value.length > 1 && ctx.measureText(`${value}…`).width > maxW) value = value.slice(0, -1);
	return `${value}…`;
}
function fillTracked(ctx, text, x, y, align, tracking) {
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
function resolveText(spec, input, scene) {
	if (spec.role === "title") return reelCopy(input.title);
	if (spec.role === "sub") return reelCopy(spec.text || scene.label, scene.label);
	if (spec.role === "kicker") return reelCopy(spec.text || input.template.category, input.template.category).toUpperCase();
	if (spec.role === "counter") return String(scene.index + 1).padStart(2, "0");
	return reelCopy(spec.text || scene.role, scene.role);
}
function drawText(ctx, spec, input, scene, u) {
	const raw = reelCopy(resolveText(spec, input, scene));
	if (!raw.trim()) return;
	const placed = spec.rotate ? spec : {
		...spec,
		x: spec.align === "center" ? spec.x : spec.align === "right" ? Math.min(spec.x, CANVAS_W - SAFE.right) : Math.max(SAFE.left, spec.x),
		y: clamp(spec.y, SAFE.top, CANVAS_H - SAFE.bottom - 36),
		maxW: Math.min(spec.maxW, CANVAS_W - SAFE.left - SAFE.right)
	};
	if (!placed.rotate) placed.maxH = Math.max(28, Math.min(placed.maxH, CANVAS_H - SAFE.bottom - placed.y));
	if (placed.motion === "rise") placed.y += (1 - u) * 28;
	if (placed.motion === "slide") placed.x += (1 - u) * 36;
	const family = scriptFamily(raw, input.fontFamily, placed.font);
	let size = Math.max(16, Math.round(placed.size * input.fontScale));
	const min = Math.max(16, Math.round(placed.size * .42));
	let lines = [raw];
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
		ctx.rotate(placed.rotate * Math.PI / 180);
		ctx.font = `${placed.italic ? "italic " : ""}${placed.weight} ${size}px ${family}`;
		paint();
		ctx.restore();
		return;
	}
	ctx.font = `${placed.italic ? "italic " : ""}${placed.weight} ${size}px ${family}`;
	paint();
}
function drawDeco(ctx, deco) {
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
function drawSlot(ctx, compositionSlot, asset, input, sceneIndex, u) {
	const shift = motionShift(input.template.motion, u, input.speed, sceneIndex, compositionSlot.asset);
	ctx.save();
	const cx = compositionSlot.x + compositionSlot.w / 2;
	const cy = compositionSlot.y + compositionSlot.h / 2;
	if (compositionSlot.rot) {
		ctx.translate(cx, cy);
		ctx.rotate(compositionSlot.rot * Math.PI / 180);
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
		roundPath(ctx, compositionSlot.x - padX, compositionSlot.y - padTop, compositionSlot.w + 44, compositionSlot.h + padTop + foot, 3);
		ctx.fill();
	}
	ctx.save();
	clipSlot(ctx, compositionSlot);
	ctx.clip();
	let drew = false;
	let missing;
	if (compositionSlot.mono) ctx.filter = "grayscale(1) contrast(1.06)";
	const bitmap = asset ? input.bitmap(asset) : null;
	if (bitmap) {
		drew = cover(ctx, bitmap, compositionSlot.x, compositionSlot.y, compositionSlot.w, compositionSlot.h, (compositionSlot.focusX ?? .5) + shift.x, (compositionSlot.focusY ?? .45) + shift.y, (compositionSlot.scale ?? 1) * shift.scale);
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
			ctx.font = "600 28px \"DM Sans\", sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(missing, compositionSlot.x + compositionSlot.w / 2, compositionSlot.y + compositionSlot.h / 2, compositionSlot.w - 24);
			drew = true;
			missing = void 0;
		}
	}
	ctx.filter = "none";
	ctx.restore();
	if (compositionSlot.caption) {
		const caption = reelCopy(input.title);
		if (caption) {
			ctx.fillStyle = "#2a241c";
			ctx.font = "italic 32px \"Playfair Display\", Georgia, serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "top";
			const footY = compositionSlot.y + compositionSlot.h + 16;
			const maxW = compositionSlot.w - 16;
			const line = ellipsize(ctx, caption, maxW);
			ctx.fillText(line, compositionSlot.x + compositionSlot.w / 2, footY, maxW);
		}
	}
	ctx.restore();
	return {
		drew,
		missing
	};
}
function renderComposition(ctx, composition, input, scene, u) {
	ctx.save();
	ctx.setTransform(ctx.canvas.width / CANVAS_W, 0, 0, ctx.canvas.height / CANVAS_H, 0, 0);
	ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
	ctx.fillStyle = composition.bg;
	ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
	for (const deco of composition.decos) if (deco.layer === "back") drawDeco(ctx, deco);
	let drewMedia = false;
	let missingTitle;
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
		ctx.font = "700 24px \"DM Sans\", sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("DEMO", 62, 48);
	}
	ctx.restore();
	return {
		sceneIndex: scene.index,
		drewMedia,
		missingTitle
	};
}
var bufferA = null;
var bufferB = null;
function scratch(which) {
	const existing = which === "a" ? bufferA : bufferB;
	if (existing) return existing;
	const canvas = document.createElement("canvas");
	canvas.width = CANVAS_W;
	canvas.height = CANVAS_H;
	if (which === "a") bufferA = canvas;
	else bufferB = canvas;
	return canvas;
}
function composite(ctx, from, to, blend, kind) {
	const p = clamp(blend, 0, 1);
	const paint = (source, alpha = 1, dx = 0) => {
		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.drawImage(source, dx, 0, CANVAS_W, CANVAS_H);
		ctx.restore();
	};
	if (kind === "hard") {
		paint(p < .5 ? from : to);
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
		paint(p > .45 ? to : from, p > .45 ? (p - .45) / .55 : 1 - p / .45);
		return;
	}
	if (kind === "flash") {
		paint(p < .5 ? from : to);
		ctx.fillStyle = `rgba(255,248,236,${(p < .5 ? p * 2 : (1 - p) * 2) * .82})`;
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
		return;
	}
	paint(from);
	paint(to, p);
}
function paintFrame(ctx, input) {
	if (!input.scenes.length) {
		ctx.setTransform(ctx.canvas.width / CANVAS_W, 0, 0, ctx.canvas.height / CANVAS_H, 0, 0);
		ctx.fillStyle = "#0b0d10";
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
		ctx.fillStyle = "#e8e1d5";
		ctx.font = "600 42px \"DM Sans\", sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Select media, then build", CANVAS_W / 2, CANVAS_H / 2);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		return {
			sceneIndex: 0,
			drewMedia: false
		};
	}
	const durations = sceneDurations(input.duration, input.scenes.length);
	const spot = locate(input.time, durations, (index) => transitionSeconds(input.template.transition, input.speed, index));
	const scene = input.scenes[spot.index] ?? input.scenes[0];
	const drawOne = (target, index, u) => {
		const current = input.scenes[index] ?? scene;
		return renderComposition(target, compose(input.template, current), input, current, u);
	};
	if (spot.blend > .001 && input.scenes.length > 1 && typeof document !== "undefined") {
		const primary = drawOne(scratch("a").getContext("2d"), spot.index, spot.u);
		const incoming = drawOne(scratch("b").getContext("2d"), spot.next, .04);
		ctx.setTransform(ctx.canvas.width / CANVAS_W, 0, 0, ctx.canvas.height / CANVAS_H, 0, 0);
		composite(ctx, scratch("a"), scratch("b"), spot.blend, input.template.transition);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		return {
			sceneIndex: spot.index,
			drewMedia: primary.drewMedia && incoming.drewMedia,
			missingTitle: primary.missingTitle || incoming.missingTitle
		};
	}
	const result = drawOne(ctx, spot.index, spot.u);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	return result;
}
function frameHasContent(ctx) {
	try {
		const { width, height, data } = (() => {
			const image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
			return {
				width: ctx.canvas.width,
				height: ctx.canvas.height,
				data: image.data
			};
		})();
		const points = [
			[.5, .45],
			[.2, .3],
			[.8, .3],
			[.5, .7],
			[.3, .8],
			[.75, .62]
		];
		let min = 255;
		let max = 0;
		for (const [fx, fy] of points) {
			const x = Math.min(width - 1, Math.max(0, Math.floor(fx * width)));
			const index = (Math.min(height - 1, Math.max(0, Math.floor(fy * height))) * width + x) * 4;
			const lum = (data[index] ?? 0) * .3 + (data[index + 1] ?? 0) * .59 + (data[index + 2] ?? 0) * .11;
			min = Math.min(min, lum);
			max = Math.max(max, lum);
		}
		return max - min > 6 || max > 18;
	} catch {
		return false;
	}
}
function proxied(url) {
	if (!url) return "";
	if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/api/media-proxy?")) return url;
	return `/api/media-proxy?url=${encodeURIComponent(url)}`;
}
function unique(values) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const value of values) {
		if (!value || seen.has(value)) continue;
		seen.add(value);
		out.push(value);
	}
	return out;
}
function loadImage(url, ms) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.crossOrigin = "anonymous";
		const timer = window.setTimeout(() => {
			image.src = "";
			reject(/* @__PURE__ */ new Error(`timed out after ${Math.round(ms / 1e3)} seconds`));
		}, ms);
		image.onload = () => {
			window.clearTimeout(timer);
			if (image.naturalWidth < 2 || image.naturalHeight < 2) {
				reject(/* @__PURE__ */ new Error("decoded without dimensions"));
				return;
			}
			resolve(image);
		};
		image.onerror = () => {
			window.clearTimeout(timer);
			reject(/* @__PURE__ */ new Error("could not be decoded"));
		};
		image.src = url;
	});
}
function seek(video, time) {
	const target = Math.max(0, Math.min(time, Math.max(0, (video.duration || time) - .04)));
	if (Math.abs(video.currentTime - target) < .05 && video.readyState >= 2) return Promise.resolve();
	return new Promise((resolve, reject) => {
		const timer = window.setTimeout(() => {
			video.removeEventListener("seeked", onSeek);
			reject(/* @__PURE__ */ new Error("seek timed out"));
		}, 8e3);
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
			reject(error instanceof Error ? error : /* @__PURE__ */ new Error("seek failed"));
		}
	});
}
function loadVideo(url, ms) {
	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
		video.muted = true;
		video.defaultMuted = true;
		video.playsInline = true;
		video.setAttribute("playsinline", "");
		video.preload = "auto";
		video.crossOrigin = "anonymous";
		let settled = false;
		const finish = (error, value) => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timer);
			video.onloadeddata = null;
			video.onerror = null;
			if (error || !value) reject(error ?? /* @__PURE__ */ new Error("could not be decoded"));
			else resolve(value);
		};
		const timer = window.setTimeout(() => finish(/* @__PURE__ */ new Error(`timed out after ${Math.round(ms / 1e3)} seconds`)), ms);
		let armed = false;
		const ready = () => {
			if (armed || video.videoWidth < 2 || !Number.isFinite(video.duration) || video.duration <= 0) return;
			armed = true;
			const opener = Math.min(.12, Math.max(0, video.duration * .02));
			seek(video, opener).then(() => finish(void 0, video), () => finish(void 0, video));
		};
		video.onloadeddata = ready;
		video.onloadedmetadata = ready;
		video.onerror = () => finish(/* @__PURE__ */ new Error("could not be decoded"));
		video.src = url;
		video.load();
	});
}
async function loadAsset(asset) {
	if (asset.demo) return { asset };
	const candidates = unique([
		asset.playUrl,
		asset.thumb,
		asset.originalUrl ?? "",
		asset.url
	]);
	if (!candidates.length) throw new Error("has no playable file");
	let last = "could not be loaded";
	for (const candidate of candidates.slice(0, 3)) for (let attempt = 0; attempt < 2; attempt++) try {
		if (asset.kind === "video") return {
			asset,
			video: await loadVideo(proxied(candidate), 18e3)
		};
		return {
			asset,
			image: await loadImage(proxied(candidate), 12e3)
		};
	} catch (error) {
		last = error instanceof Error ? error.message : "could not be loaded";
	}
	const reason = /timed out/i.test(last) ? `${asset.source} ${asset.kind} timed out after ${asset.kind === "video" ? 18 : 12} seconds.` : `${asset.source} ${asset.kind} failed to load (${last}).`;
	throw new Error(reason);
}
async function loadThumb(asset) {
	const src = asset.thumb || asset.playUrl || asset.url;
	if (!src) throw new Error("no thumbnail");
	if (asset.local && asset.kind === "image") return loadImage(src, 8e3);
	return loadImage(proxied(src), 12e3);
}
function videoTimeFor(video, sceneIndex, u, sceneDur, speed) {
	const duration = video.duration;
	if (!Number.isFinite(duration) || duration <= .1) return 0;
	const rate = speed === "fast" ? 1.15 : speed === "slow" ? .85 : 1;
	const span = Math.min(duration * .92, Math.max(.45, sceneDur * rate));
	const start = Math.max(0, duration - span - .05) * (sceneIndex * .37 % 1);
	return Math.min(duration - .04, start + Math.max(0, Math.min(1, u)) * span);
}
async function seekVideo(video, time) {
	if (video.readyState < 1) throw new Error("video metadata is not loaded");
	await seek(video, time);
}
async function ensureFonts(family) {
	const families = [
		family,
		"Playfair Display",
		"DM Sans",
		"Noto Sans Devanagari",
		"Noto Sans Gujarati",
		"Noto Sans Tamil"
	];
	await Promise.all(families.filter(Boolean).map(async (name) => {
		try {
			await document.fonts.load(`700 64px "${name}"`);
		} catch {}
	}));
	await document.fonts.ready;
}
function releaseVideo(video) {
	if (!video) return;
	try {
		video.pause();
		video.removeAttribute("src");
		video.load();
	} catch {}
}
var BEATS = {
	cinema: [
		{
			role: "OPEN",
			label: "Atmosphere"
		},
		{
			role: "HERO",
			label: "Hero"
		},
		{
			role: "DETAIL",
			label: "Detail"
		},
		{
			role: "MOVE",
			label: "Movement"
		},
		{
			role: "END",
			label: "Meaning"
		}
	],
	edit: [
		{
			role: "HOOK",
			label: "Hook"
		},
		{
			role: "HERO",
			label: "Feature"
		},
		{
			role: "DETAIL",
			label: "Detail"
		},
		{
			role: "NOTE",
			label: "Context"
		},
		{
			role: "END",
			label: "Close"
		}
	],
	fest: [
		{
			role: "HOOK",
			label: "Hook"
		},
		{
			role: "CUT",
			label: "Cut"
		},
		{
			role: "PEAK",
			label: "Peak"
		},
		{
			role: "END",
			label: "Release"
		}
	],
	story: [
		{
			role: "OPEN",
			label: "Opening"
		},
		{
			role: "HERO",
			label: "Hero"
		},
		{
			role: "DETAIL",
			label: "Detail"
		},
		{
			role: "MEAN",
			label: "Meaning"
		},
		{
			role: "END",
			label: "Close"
		}
	],
	doc: [
		{
			role: "OPEN",
			label: "Establish"
		},
		{
			role: "HERO",
			label: "Record"
		},
		{
			role: "DETAIL",
			label: "Evidence"
		},
		{
			role: "NOTE",
			label: "Context"
		},
		{
			role: "END",
			label: "Close"
		}
	]
};
var LOOKS = [
	{
		id: "gold-cinema",
		name: "Gold and Black Cinematic",
		palette: "gold",
		layout: "dawn",
		motion: "slow-push",
		transition: "fade",
		duration: 24,
		beats: "cinema",
		category: "Cinematic",
		description: "Letterbox, slow push, and a low title."
	},
	{
		id: "night-focus",
		name: "Black Focus",
		palette: "night",
		layout: "focus",
		motion: "slow-pull",
		transition: "mask",
		duration: 24,
		beats: "cinema",
		category: "Cinematic",
		description: "Spotlight circle holding one subject."
	},
	{
		id: "forest-journey",
		name: "Green Journey",
		palette: "forest",
		layout: "journey",
		motion: "pan-right",
		transition: "crossfade",
		duration: 26,
		beats: "cinema",
		category: "Cinematic",
		description: "Hero window with a detail strip."
	},
	{
		id: "night-meaning",
		name: "Quiet Meaning",
		palette: "night",
		layout: "meaning",
		motion: "drift",
		transition: "fade",
		duration: 22,
		beats: "story",
		category: "Minimal",
		description: "Almost no chrome. Title sits low."
	},
	{
		id: "teal-editorial",
		name: "Blue and White Editorial",
		palette: "teal",
		layout: "split",
		motion: "pan-left",
		transition: "slide",
		duration: 20,
		beats: "edit",
		category: "Editorial",
		description: "Type column beside a tall picture."
	},
	{
		id: "indigo-column",
		name: "Indigo Column",
		palette: "indigo",
		layout: "column",
		motion: "pan-right",
		transition: "slide",
		duration: 20,
		beats: "edit",
		category: "Editorial",
		description: "Narrow headline beside the photograph."
	},
	{
		id: "cream-frame",
		name: "Cream Framed Print",
		palette: "cream",
		layout: "eframe",
		motion: "reveal",
		transition: "fade",
		duration: 18,
		beats: "edit",
		category: "Editorial",
		description: "Caption sitting under a framed print."
	},
	{
		id: "marigold-story",
		name: "Yellow Story Plate",
		palette: "marigold",
		layout: "estory",
		motion: "reveal",
		transition: "wipe",
		duration: 20,
		beats: "edit",
		category: "Editorial",
		description: "Picture, stacked headline, then a close."
	},
	{
		id: "sandal-cover",
		name: "Beige Magazine Cover",
		palette: "sandal",
		layout: "cover",
		motion: "slow-push",
		transition: "wipe",
		duration: 18,
		beats: "edit",
		category: "Magazine",
		description: "Masthead, cover image, issue headline."
	},
	{
		id: "teal-feature",
		name: "Teal Feature",
		palette: "teal",
		layout: "feature",
		motion: "slow-pull",
		transition: "crossfade",
		duration: 18,
		beats: "edit",
		category: "Magazine",
		description: "Top photograph and a short deck."
	},
	{
		id: "vermilion-bold",
		name: "Red and White Bold",
		palette: "vermilion",
		layout: "mbold",
		motion: "crop-punch",
		transition: "flash",
		duration: 14,
		beats: "fest",
		category: "Magazine",
		description: "Oversized type over a full-bleed photo."
	},
	{
		id: "ivory-polaroid",
		name: "Vintage Polaroid",
		palette: "ivory",
		layout: "polaroid",
		motion: "drift",
		transition: "fade",
		duration: 20,
		beats: "story",
		category: "Memory",
		description: "Tilted print, white border, caption foot."
	},
	{
		id: "rose-diary",
		name: "Blush Diary",
		palette: "rose",
		layout: "diary",
		motion: "drift",
		transition: "fade",
		duration: 22,
		beats: "story",
		category: "Memory",
		description: "Paper page with a taped photograph."
	},
	{
		id: "forest-scrap",
		name: "Colorful Scrapbook",
		palette: "forest",
		layout: "scrapbook",
		motion: "pan-left",
		transition: "wipe",
		duration: 18,
		beats: "story",
		category: "Memory",
		description: "Prints placed like a travel page."
	},
	{
		id: "gold-grid",
		name: "Gold Photo Collage",
		palette: "gold",
		layout: "grid",
		motion: "reveal",
		transition: "hard",
		duration: 14,
		beats: "fest",
		category: "Collage",
		description: "A separate cell for every selected photo."
	},
	{
		id: "ivory-dgrid",
		name: "Neutral Dynamic Grid",
		palette: "ivory",
		layout: "dgrid",
		motion: "reveal",
		transition: "slide",
		duration: 16,
		beats: "fest",
		category: "Collage",
		description: "One large plate and supporting crops."
	},
	{
		id: "brass-wall",
		name: "Warm Photo Wall",
		palette: "brass",
		layout: "wall",
		motion: "diagonal",
		transition: "slide",
		duration: 16,
		beats: "fest",
		category: "Collage",
		description: "Overlapping prints at different angles."
	},
	{
		id: "teal-multi",
		name: "White Blue Multi Frame",
		palette: "teal",
		layout: "mframe",
		motion: "pan-left",
		transition: "crossfade",
		duration: 16,
		beats: "edit",
		category: "Collage",
		description: "Main frame with smaller frames under it."
	},
	{
		id: "gold-sacred",
		name: "Arched Window",
		palette: "gold",
		layout: "sacred",
		motion: "slow-push",
		transition: "reveal",
		duration: 26,
		beats: "story",
		category: "Devotional",
		description: "Arched picture, brass rule, quiet title."
	},
	{
		id: "brass-temple",
		name: "Cream and Brass Elegant",
		palette: "brass",
		layout: "temple",
		motion: "slow-pull",
		transition: "reveal",
		duration: 26,
		beats: "cinema",
		category: "Devotional",
		description: "Warm light from above, title held low."
	},
	{
		id: "sandal-devotion",
		name: "Sandal Devotional",
		palette: "sandal",
		layout: "devotional",
		motion: "slow-push",
		transition: "fade",
		duration: 24,
		beats: "story",
		category: "Devotional",
		description: "Centered portrait with a line beneath."
	},
	{
		id: "marigold-fest",
		name: "Yellow Festival",
		palette: "marigold",
		layout: "energy",
		motion: "crop-punch",
		transition: "flash",
		duration: 12,
		beats: "fest",
		category: "Festival",
		description: "Full-bleed cuts and a strong title."
	},
	{
		id: "marigold-burst",
		name: "Marigold Burst",
		palette: "marigold",
		layout: "burst",
		motion: "crop-punch",
		transition: "flash",
		duration: 12,
		beats: "fest",
		category: "Festival",
		description: "Tilted picture window and a large word."
	},
	{
		id: "vermilion-crowd",
		name: "Red Crowd Motion",
		palette: "vermilion",
		layout: "crowd",
		motion: "diagonal",
		transition: "hard",
		duration: 12,
		beats: "fest",
		category: "Festival",
		description: "Tight moving crop, almost no type."
	},
	{
		id: "slate-doc",
		name: "Grey Documentary",
		palette: "slate",
		layout: "doc",
		motion: "pan-up",
		transition: "film-cut",
		duration: 20,
		beats: "doc",
		category: "Documentary",
		description: "Film edges and a source line."
	},
	{
		id: "copper-time",
		name: "Copper Timeline",
		palette: "copper",
		layout: "timeline",
		motion: "pan-right",
		transition: "film-cut",
		duration: 20,
		beats: "doc",
		category: "Documentary",
		description: "A ruled timeline beside the picture."
	},
	{
		id: "slate-journal",
		name: "Slate Journal",
		palette: "slate",
		layout: "journal",
		motion: "drift",
		transition: "crossfade",
		duration: 20,
		beats: "doc",
		category: "Heritage",
		description: "Margin notes, picture held to the right."
	},
	{
		id: "forest-heritage",
		name: "Green Heritage Frame",
		palette: "forest",
		layout: "hframe",
		motion: "slow-pull",
		transition: "film-cut",
		duration: 22,
		beats: "doc",
		category: "Heritage",
		description: "Double frame and an archival caption."
	},
	{
		id: "ivory-minimal",
		name: "Beige Minimalist",
		palette: "ivory",
		layout: "minimal",
		motion: "drift",
		transition: "crossfade",
		duration: 16,
		beats: "story",
		category: "Minimal",
		description: "Wide margin and one quiet photograph."
	},
	{
		id: "cream-quote",
		name: "Neutral Quote",
		palette: "cream",
		layout: "quote",
		motion: "drift",
		transition: "fade",
		duration: 16,
		beats: "story",
		category: "Minimal",
		description: "The line is the scene. The picture recedes."
	},
	{
		id: "charcoal-mono",
		name: "Black and White Mono",
		palette: "charcoal",
		layout: "mono",
		motion: "pan-up",
		transition: "film-cut",
		duration: 18,
		beats: "doc",
		category: "Minimal",
		description: "Monochrome picture, vertical side title."
	},
	{
		id: "indigo-kinetic",
		name: "Blue Kinetic Type",
		palette: "indigo",
		layout: "kinetic",
		motion: "diagonal",
		transition: "hard",
		duration: 12,
		beats: "fest",
		category: "Special",
		description: "The headline moves over the picture."
	},
	{
		id: "rose-crop",
		name: "Pink Dynamic Crop",
		palette: "rose",
		layout: "dcrop",
		motion: "diagonal",
		transition: "mask",
		duration: 14,
		beats: "fest",
		category: "Special",
		description: "The window changes crop scene to scene."
	},
	{
		id: "copper-news",
		name: "Copper News Desk",
		palette: "copper",
		layout: "news",
		motion: "pan-left",
		transition: "wipe",
		duration: 12,
		beats: "fest",
		category: "Special",
		description: "Desk bar, headline block, bottom line."
	},
	{
		id: "charcoal-label",
		name: "Black Vertical Label",
		palette: "charcoal",
		layout: "vlabel",
		motion: "pan-up",
		transition: "wipe",
		duration: 16,
		beats: "edit",
		category: "Special",
		description: "Side-set type over a full photograph."
	},
	{
		id: "indigo-sacred",
		name: "Indigo Sacred Record",
		palette: "indigo",
		layout: "sacredoc",
		motion: "slow-push",
		transition: "fade",
		duration: 22,
		beats: "doc",
		category: "Devotional",
		description: "Arched picture with a caption block."
	},
	{
		id: "rose-card",
		name: "Pink Story Card",
		palette: "rose",
		layout: "cards",
		motion: "slow-push",
		transition: "fade",
		duration: 16,
		beats: "story",
		category: "Special",
		description: "One poster card: picture, title, footer."
	},
	{
		id: "night-finale",
		name: "Night Finale",
		palette: "night",
		layout: "finale",
		motion: "slow-push",
		transition: "mask",
		duration: 12,
		beats: "story",
		category: "Special",
		description: "Closing poster. Picture, then a large name."
	}
];
var LOOK = Object.fromEntries(LOOKS.map((look) => [look.id, look]));
/** Top tabs. Switching one replaces the shelf headings underneath, the way Canva's template browser does. */
var TEMPLATE_TABS = [
	{
		id: "for-you",
		label: "For you"
	},
	{
		id: "social",
		label: "Social media"
	},
	{
		id: "video",
		label: "Video"
	},
	{
		id: "marketing",
		label: "Marketing"
	},
	{
		id: "print",
		label: "Print"
	},
	{
		id: "events",
		label: "Events"
	},
	{
		id: "business",
		label: "Business"
	},
	{
		id: "education",
		label: "Education"
	},
	{
		id: "personal",
		label: "Personal"
	}
];
var storyLooks = [
	"night-focus",
	"rose-card",
	"ivory-polaroid",
	"marigold-fest",
	"cream-quote",
	"brass-temple",
	"rose-diary",
	"night-meaning"
];
var reelLooks = [
	"gold-cinema",
	"forest-journey",
	"marigold-fest",
	"indigo-kinetic",
	"vermilion-crowd",
	"rose-crop",
	"marigold-burst",
	"night-finale"
];
var posterLooks = [
	"vermilion-bold",
	"sandal-cover",
	"gold-sacred",
	"charcoal-label",
	"cream-frame",
	"marigold-burst",
	"night-finale",
	"teal-feature"
];
var collageLooks = [
	"gold-grid",
	"ivory-dgrid",
	"brass-wall",
	"teal-multi",
	"forest-scrap",
	"ivory-polaroid",
	"rose-crop",
	"cream-frame"
];
var quoteLooks = [
	"cream-quote",
	"ivory-minimal",
	"night-meaning",
	"charcoal-mono",
	"indigo-kinetic",
	"rose-card",
	"slate-journal",
	"gold-sacred"
];
var festLooks = [
	"marigold-fest",
	"marigold-burst",
	"brass-temple",
	"gold-sacred",
	"vermilion-crowd",
	"sandal-devotion",
	"gold-cinema",
	"rose-card"
];
var eduLooks = [
	"slate-journal",
	"cream-quote",
	"ivory-minimal",
	"copper-time",
	"teal-editorial",
	"indigo-column",
	"slate-doc",
	"cream-frame"
];
var memoryLooks = [
	"ivory-polaroid",
	"rose-diary",
	"forest-scrap",
	"forest-journey",
	"night-meaning",
	"brass-wall",
	"cream-frame",
	"gold-grid"
];
var inviteLooks = [
	"brass-temple",
	"rose-card",
	"gold-sacred",
	"ivory-minimal",
	"sandal-cover",
	"cream-quote",
	"rose-diary",
	"night-finale"
];
var SECTIONS = [
	{
		id: "trending",
		heading: "Trending now",
		tab: "for-you",
		featured: true,
		noun: "Template",
		looks: [
			"gold-cinema",
			"vermilion-bold",
			"marigold-fest",
			"ivory-polaroid",
			"indigo-kinetic",
			"rose-card",
			"gold-grid",
			"cream-quote"
		]
	},
	{
		id: "ig-post",
		heading: "Instagram Posts",
		tab: "social",
		noun: "Instagram Post",
		looks: [
			"sandal-cover",
			"teal-feature",
			"vermilion-bold",
			"ivory-minimal",
			"cream-quote",
			"gold-grid",
			"teal-editorial",
			"copper-news"
		]
	},
	{
		id: "ig-story",
		heading: "Instagram Stories",
		tab: "social",
		featured: true,
		noun: "Instagram Story",
		looks: [...storyLooks]
	},
	{
		id: "ig-reel",
		heading: "Instagram Reels",
		tab: "social",
		featured: true,
		noun: "Instagram Reel",
		looks: [...reelLooks]
	},
	{
		id: "fb-post",
		heading: "Facebook Posts",
		tab: "social",
		noun: "Facebook Post",
		looks: [
			"teal-editorial",
			"indigo-column",
			"copper-news",
			"teal-feature",
			"marigold-story",
			"vermilion-bold",
			"sandal-cover",
			"cream-quote"
		]
	},
	{
		id: "fb-story",
		heading: "Facebook Stories",
		tab: "social",
		noun: "Facebook Story",
		looks: [
			"night-focus",
			"marigold-fest",
			"rose-card",
			"marigold-burst",
			"indigo-kinetic",
			"gold-cinema",
			"ivory-polaroid",
			"cream-quote"
		]
	},
	{
		id: "tiktok",
		heading: "TikTok Videos",
		tab: "social",
		noun: "TikTok Video",
		looks: [
			"indigo-kinetic",
			"marigold-fest",
			"marigold-burst",
			"vermilion-crowd",
			"rose-crop",
			"vermilion-bold",
			"copper-news",
			"night-finale"
		]
	},
	{
		id: "yt-thumb",
		heading: "YouTube Thumbnails",
		tab: "social",
		featured: true,
		noun: "YouTube Thumbnail",
		looks: [
			"vermilion-bold",
			"copper-news",
			"sandal-cover",
			"indigo-kinetic",
			"marigold-burst",
			"charcoal-label",
			"teal-feature",
			"charcoal-mono"
		]
	},
	{
		id: "yt-short",
		heading: "YouTube Shorts",
		tab: "social",
		noun: "YouTube Short",
		looks: [
			"gold-cinema",
			"indigo-kinetic",
			"marigold-fest",
			"night-focus",
			"rose-crop",
			"vermilion-crowd",
			"forest-journey",
			"night-finale"
		]
	},
	{
		id: "pin",
		heading: "Pinterest Pins",
		tab: "social",
		noun: "Pinterest Pin",
		looks: [
			"sandal-cover",
			"rose-diary",
			"forest-scrap",
			"cream-quote",
			"ivory-minimal",
			"teal-feature",
			"ivory-polaroid",
			"marigold-story"
		]
	},
	{
		id: "li-post",
		heading: "LinkedIn Posts",
		tab: "social",
		noun: "LinkedIn Post",
		looks: [
			"indigo-column",
			"teal-editorial",
			"copper-news",
			"ivory-minimal",
			"slate-doc",
			"copper-time",
			"cream-quote",
			"teal-feature"
		]
	},
	{
		id: "wa-status",
		heading: "WhatsApp Status",
		tab: "social",
		noun: "WhatsApp Status",
		looks: [
			"rose-card",
			"marigold-fest",
			"cream-quote",
			"ivory-polaroid",
			"marigold-burst",
			"ivory-minimal",
			"gold-sacred",
			"vermilion-bold"
		]
	},
	{
		id: "x-post",
		heading: "X Posts",
		tab: "social",
		noun: "X Post",
		looks: [
			"copper-news",
			"vermilion-bold",
			"cream-quote",
			"ivory-minimal",
			"indigo-kinetic",
			"charcoal-mono",
			"indigo-column",
			"charcoal-label"
		]
	},
	{
		id: "snap",
		heading: "Snapchat Stories",
		tab: "social",
		noun: "Snapchat Story",
		looks: [
			"marigold-burst",
			"rose-crop",
			"indigo-kinetic",
			"vermilion-crowd",
			"rose-card",
			"gold-grid",
			"night-focus",
			"marigold-fest"
		]
	},
	{
		id: "reels",
		heading: "Reels",
		tab: "video",
		noun: "Reel",
		looks: [...reelLooks]
	},
	{
		id: "stories",
		heading: "Stories",
		tab: "video",
		noun: "Story",
		looks: [...storyLooks]
	},
	{
		id: "landscape",
		heading: "Landscape Videos",
		tab: "video",
		noun: "Landscape Video",
		looks: [
			"forest-journey",
			"teal-editorial",
			"copper-time",
			"slate-doc",
			"night-meaning",
			"teal-feature",
			"slate-journal",
			"gold-cinema"
		]
	},
	{
		id: "promo-video",
		heading: "Promo Videos",
		tab: "video",
		noun: "Promo Video",
		looks: [
			"vermilion-bold",
			"indigo-kinetic",
			"marigold-burst",
			"copper-news",
			"sandal-cover",
			"night-finale",
			"gold-cinema",
			"rose-card"
		]
	},
	{
		id: "yt-intro",
		heading: "YouTube Intros",
		tab: "video",
		noun: "YouTube Intro",
		looks: [
			"gold-cinema",
			"night-focus",
			"night-meaning",
			"forest-journey",
			"brass-temple",
			"night-finale",
			"charcoal-mono",
			"indigo-kinetic"
		]
	},
	{
		id: "cinematic",
		heading: "Cinematic",
		tab: "video",
		noun: "Cinematic Cut",
		looks: [
			"gold-cinema",
			"night-focus",
			"forest-journey",
			"night-meaning",
			"brass-temple",
			"charcoal-mono",
			"slate-doc",
			"night-finale"
		]
	},
	{
		id: "documentary",
		heading: "Documentary",
		tab: "video",
		noun: "Documentary",
		looks: [
			"slate-doc",
			"copper-time",
			"forest-heritage",
			"slate-journal",
			"indigo-sacred",
			"charcoal-mono",
			"cream-frame",
			"night-meaning"
		]
	},
	{
		id: "kinetic",
		heading: "Kinetic Type",
		tab: "video",
		noun: "Kinetic Video",
		looks: [
			"indigo-kinetic",
			"vermilion-bold",
			"charcoal-label",
			"rose-crop",
			"marigold-burst",
			"copper-news",
			"cream-quote",
			"night-finale"
		]
	},
	{
		id: "sale",
		heading: "Sale & Promo",
		tab: "marketing",
		noun: "Sale Post",
		looks: [
			"vermilion-bold",
			"marigold-burst",
			"copper-news",
			"marigold-fest",
			"sandal-cover",
			"indigo-kinetic",
			"rose-card",
			"gold-grid"
		]
	},
	{
		id: "product",
		heading: "Product Highlights",
		tab: "marketing",
		noun: "Product Highlight",
		looks: [
			"night-focus",
			"teal-feature",
			"cream-frame",
			"sandal-cover",
			"ivory-minimal",
			"gold-cinema",
			"rose-card",
			"charcoal-label"
		]
	},
	{
		id: "announce",
		heading: "Announcements",
		tab: "marketing",
		noun: "Announcement",
		looks: [
			"copper-news",
			"vermilion-bold",
			"teal-editorial",
			"rose-card",
			"indigo-column",
			"marigold-fest",
			"cream-quote",
			"sandal-cover"
		]
	},
	{
		id: "ads",
		heading: "Ads",
		tab: "marketing",
		noun: "Ad",
		looks: [
			"vermilion-bold",
			"indigo-kinetic",
			"night-focus",
			"marigold-burst",
			"copper-news",
			"gold-cinema",
			"charcoal-mono",
			"rose-crop"
		]
	},
	{
		id: "flyers",
		heading: "Flyers",
		tab: "marketing",
		featured: true,
		noun: "Flyer",
		looks: [
			"sandal-cover",
			"vermilion-bold",
			"teal-feature",
			"marigold-story",
			"gold-sacred",
			"cream-frame",
			"indigo-column",
			"rose-card"
		]
	},
	{
		id: "posters",
		heading: "Posters",
		tab: "marketing",
		featured: true,
		noun: "Poster",
		looks: [...posterLooks]
	},
	{
		id: "brand",
		heading: "Brand Stories",
		tab: "marketing",
		noun: "Brand Story",
		looks: [
			"gold-cinema",
			"ivory-minimal",
			"teal-editorial",
			"night-meaning",
			"sandal-cover",
			"charcoal-mono",
			"forest-journey",
			"cream-quote"
		]
	},
	{
		id: "logos",
		heading: "Logos",
		tab: "marketing",
		noun: "Logo",
		looks: [
			"charcoal-mono",
			"gold-sacred",
			"ivory-minimal",
			"vermilion-bold",
			"brass-temple",
			"cream-quote",
			"night-finale",
			"charcoal-label"
		]
	},
	{
		id: "print-posters",
		heading: "Posters",
		tab: "print",
		noun: "Print Poster",
		looks: [...posterLooks]
	},
	{
		id: "print-flyers",
		heading: "Flyers",
		tab: "print",
		noun: "Print Flyer",
		looks: [
			"teal-feature",
			"marigold-story",
			"sandal-cover",
			"cream-frame",
			"indigo-column",
			"vermilion-bold",
			"rose-diary",
			"slate-journal"
		]
	},
	{
		id: "print-invite",
		heading: "Invitations",
		tab: "print",
		featured: true,
		noun: "Invitation",
		looks: [...inviteLooks]
	},
	{
		id: "cards",
		heading: "Cards",
		tab: "print",
		noun: "Card",
		looks: [
			"rose-card",
			"ivory-polaroid",
			"gold-sacred",
			"cream-quote",
			"brass-temple",
			"night-finale",
			"rose-diary",
			"ivory-minimal"
		]
	},
	{
		id: "biz-cards",
		heading: "Business Cards",
		tab: "print",
		noun: "Business Card",
		looks: [
			"charcoal-mono",
			"ivory-minimal",
			"indigo-column",
			"gold-sacred",
			"teal-editorial",
			"cream-quote",
			"vermilion-bold",
			"slate-journal"
		]
	},
	{
		id: "certificates",
		heading: "Certificates",
		tab: "print",
		noun: "Certificate",
		looks: [
			"gold-sacred",
			"brass-temple",
			"cream-frame",
			"forest-heritage",
			"ivory-minimal",
			"sandal-cover",
			"indigo-sacred",
			"slate-journal"
		]
	},
	{
		id: "calendars",
		heading: "Calendars",
		tab: "print",
		noun: "Calendar",
		looks: [
			"ivory-dgrid",
			"gold-grid",
			"slate-journal",
			"cream-frame",
			"teal-multi",
			"indigo-column",
			"ivory-minimal",
			"marigold-story"
		]
	},
	{
		id: "collages",
		heading: "Photo Collages",
		tab: "print",
		featured: true,
		noun: "Photo Collage",
		looks: [...collageLooks]
	},
	{
		id: "resumes",
		heading: "Resumes",
		tab: "print",
		noun: "Resume",
		looks: [
			"indigo-column",
			"teal-editorial",
			"ivory-minimal",
			"slate-journal",
			"cream-frame",
			"charcoal-mono",
			"copper-time",
			"slate-doc"
		]
	},
	{
		id: "invoices",
		heading: "Invoices",
		tab: "print",
		noun: "Invoice",
		looks: [
			"slate-journal",
			"indigo-column",
			"ivory-minimal",
			"cream-frame",
			"teal-editorial",
			"charcoal-mono",
			"copper-time",
			"slate-doc"
		]
	},
	{
		id: "worksheets",
		heading: "Worksheets",
		tab: "print",
		noun: "Worksheet",
		looks: [
			"slate-journal",
			"ivory-minimal",
			"cream-frame",
			"indigo-column",
			"teal-editorial",
			"ivory-dgrid",
			"copper-time",
			"cream-quote"
		]
	},
	{
		id: "wallpapers",
		heading: "Desktop Wallpapers",
		tab: "print",
		noun: "Wallpaper",
		looks: [
			"gold-cinema",
			"night-focus",
			"forest-journey",
			"charcoal-mono",
			"brass-temple",
			"rose-crop",
			"night-meaning",
			"vermilion-crowd"
		]
	},
	{
		id: "tshirts",
		heading: "T-Shirts",
		tab: "print",
		noun: "T-Shirt Graphic",
		looks: [
			"vermilion-bold",
			"charcoal-label",
			"gold-sacred",
			"marigold-burst",
			"charcoal-mono",
			"cream-quote",
			"indigo-kinetic",
			"night-finale"
		]
	},
	{
		id: "festival",
		heading: "Festival",
		tab: "events",
		featured: true,
		noun: "Festival Template",
		looks: [...festLooks]
	},
	{
		id: "birthday",
		heading: "Birthday",
		tab: "events",
		noun: "Birthday",
		looks: [
			"rose-card",
			"marigold-burst",
			"ivory-polaroid",
			"gold-grid",
			"marigold-fest",
			"rose-diary",
			"vermilion-bold",
			"cream-quote"
		]
	},
	{
		id: "wedding",
		heading: "Wedding",
		tab: "events",
		noun: "Wedding",
		looks: [
			"brass-temple",
			"ivory-minimal",
			"gold-sacred",
			"rose-card",
			"cream-quote",
			"sandal-cover",
			"rose-diary",
			"night-meaning"
		]
	},
	{
		id: "event-invite",
		heading: "Invitations",
		tab: "events",
		noun: "Event Invitation",
		looks: [...inviteLooks]
	},
	{
		id: "save-date",
		heading: "Save the Date",
		tab: "events",
		noun: "Save the Date",
		looks: [
			"rose-card",
			"gold-sacred",
			"ivory-minimal",
			"brass-temple",
			"sandal-cover",
			"cream-quote",
			"ivory-polaroid",
			"night-finale"
		]
	},
	{
		id: "thanks",
		heading: "Thank You",
		tab: "events",
		noun: "Thank You",
		looks: [
			"cream-quote",
			"rose-card",
			"ivory-minimal",
			"rose-diary",
			"gold-sacred",
			"brass-temple",
			"night-meaning",
			"cream-frame"
		]
	},
	{
		id: "celebration",
		heading: "Celebration",
		tab: "events",
		noun: "Celebration",
		looks: [
			"marigold-fest",
			"marigold-burst",
			"vermilion-crowd",
			"gold-grid",
			"rose-card",
			"indigo-kinetic",
			"vermilion-bold",
			"night-finale"
		]
	},
	{
		id: "presentations",
		heading: "Presentations",
		tab: "business",
		featured: true,
		noun: "Presentation",
		looks: [
			"teal-editorial",
			"sandal-cover",
			"indigo-column",
			"night-meaning",
			"slate-doc",
			"cream-quote",
			"teal-feature",
			"gold-cinema"
		]
	},
	{
		id: "pitch",
		heading: "Pitch Decks",
		tab: "business",
		noun: "Pitch Deck",
		looks: [
			"indigo-column",
			"vermilion-bold",
			"teal-editorial",
			"copper-news",
			"charcoal-mono",
			"sandal-cover",
			"night-focus",
			"cream-quote"
		]
	},
	{
		id: "company",
		heading: "Company Intros",
		tab: "business",
		noun: "Company Intro",
		looks: [
			"gold-cinema",
			"teal-editorial",
			"ivory-minimal",
			"sandal-cover",
			"slate-doc",
			"night-meaning",
			"indigo-column",
			"charcoal-mono"
		]
	},
	{
		id: "testimonials",
		heading: "Testimonials",
		tab: "business",
		noun: "Testimonial",
		looks: [
			"cream-quote",
			"rose-card",
			"ivory-minimal",
			"teal-feature",
			"night-focus",
			"slate-journal",
			"charcoal-mono",
			"rose-diary"
		]
	},
	{
		id: "hiring",
		heading: "Hiring",
		tab: "business",
		noun: "Hiring Post",
		looks: [
			"copper-news",
			"vermilion-bold",
			"indigo-column",
			"teal-editorial",
			"charcoal-label",
			"sandal-cover",
			"cream-quote",
			"indigo-kinetic"
		]
	},
	{
		id: "proposals",
		heading: "Proposals",
		tab: "business",
		noun: "Proposal",
		looks: [
			"indigo-column",
			"slate-journal",
			"teal-editorial",
			"cream-frame",
			"slate-doc",
			"ivory-minimal",
			"copper-time",
			"sandal-cover"
		]
	},
	{
		id: "docs",
		heading: "Docs",
		tab: "business",
		noun: "Doc",
		looks: [
			"slate-journal",
			"ivory-minimal",
			"indigo-column",
			"cream-frame",
			"teal-editorial",
			"slate-doc",
			"copper-time",
			"cream-quote"
		]
	},
	{
		id: "websites",
		heading: "Websites",
		tab: "business",
		noun: "Website Hero",
		looks: [
			"gold-cinema",
			"ivory-minimal",
			"teal-editorial",
			"vermilion-bold",
			"night-focus",
			"sandal-cover",
			"forest-journey",
			"cream-quote"
		]
	},
	{
		id: "lessons",
		heading: "Lesson Covers",
		tab: "education",
		noun: "Lesson Cover",
		looks: [
			"slate-journal",
			"teal-feature",
			"ivory-minimal",
			"sandal-cover",
			"indigo-column",
			"cream-frame",
			"gold-sacred",
			"copper-time"
		]
	},
	{
		id: "quotes",
		heading: "Quotes",
		tab: "education",
		featured: true,
		noun: "Quote",
		looks: [...quoteLooks]
	},
	{
		id: "edu-sheets",
		heading: "Worksheets",
		tab: "education",
		noun: "Worksheet",
		looks: [...eduLooks]
	},
	{
		id: "class-note",
		heading: "Class Announcements",
		tab: "education",
		noun: "Class Announcement",
		looks: [
			"copper-news",
			"marigold-fest",
			"teal-editorial",
			"rose-card",
			"ivory-minimal",
			"indigo-column",
			"cream-quote",
			"vermilion-bold"
		]
	},
	{
		id: "infographics",
		heading: "Infographics",
		tab: "education",
		noun: "Infographic",
		looks: [
			"ivory-dgrid",
			"teal-multi",
			"copper-time",
			"indigo-column",
			"gold-grid",
			"slate-doc",
			"teal-editorial",
			"copper-news"
		]
	},
	{
		id: "edu-certs",
		heading: "Certificates",
		tab: "education",
		noun: "Certificate",
		looks: [
			"gold-sacred",
			"brass-temple",
			"forest-heritage",
			"cream-frame",
			"indigo-sacred",
			"ivory-minimal",
			"sandal-cover",
			"slate-journal"
		]
	},
	{
		id: "memory",
		heading: "Memory",
		tab: "personal",
		noun: "Memory",
		looks: [...memoryLooks]
	},
	{
		id: "travel",
		heading: "Travel",
		tab: "personal",
		noun: "Travel",
		looks: [
			"forest-journey",
			"forest-scrap",
			"gold-cinema",
			"ivory-polaroid",
			"slate-journal",
			"brass-wall",
			"night-meaning",
			"teal-feature"
		]
	},
	{
		id: "diary",
		heading: "Diary",
		tab: "personal",
		noun: "Diary",
		looks: [
			"rose-diary",
			"slate-journal",
			"ivory-polaroid",
			"cream-quote",
			"forest-scrap",
			"night-meaning",
			"cream-frame",
			"indigo-sacred"
		]
	},
	{
		id: "scrapbook",
		heading: "Scrapbook",
		tab: "personal",
		noun: "Scrapbook",
		looks: [
			"forest-scrap",
			"ivory-polaroid",
			"brass-wall",
			"gold-grid",
			"rose-diary",
			"ivory-dgrid",
			"teal-multi",
			"cream-frame"
		]
	},
	{
		id: "polaroids",
		heading: "Polaroids",
		tab: "personal",
		noun: "Polaroid",
		looks: [
			"ivory-polaroid",
			"rose-diary",
			"brass-wall",
			"forest-scrap",
			"cream-frame",
			"gold-grid",
			"night-focus",
			"sandal-cover"
		]
	},
	{
		id: "mood",
		heading: "Mood Boards",
		tab: "personal",
		noun: "Mood Board",
		looks: [
			"ivory-dgrid",
			"brass-wall",
			"gold-grid",
			"teal-multi",
			"rose-crop",
			"forest-scrap",
			"charcoal-mono",
			"cream-frame"
		]
	},
	{
		id: "minimal",
		heading: "Minimal",
		tab: "personal",
		noun: "Minimal",
		looks: [
			"ivory-minimal",
			"cream-quote",
			"charcoal-mono",
			"night-meaning",
			"cream-frame",
			"slate-journal",
			"night-focus",
			"gold-sacred"
		]
	},
	{
		id: "whiteboard",
		heading: "Whiteboard",
		tab: "personal",
		noun: "Whiteboard",
		looks: [
			"ivory-minimal",
			"slate-journal",
			"ivory-dgrid",
			"cream-quote",
			"teal-multi",
			"indigo-column",
			"cream-frame",
			"copper-time"
		]
	}
];
var FRAME = [
	"top rule",
	"bottom rule",
	"side rail",
	"letterbox",
	"vignette",
	"outer frame"
];
var COLORWAYS = [
	"ivory",
	"vermilion",
	"teal",
	"gold",
	"rose",
	"cream",
	"indigo",
	"marigold",
	"charcoal",
	"forest",
	"brass",
	"night"
];
function colorways(palette, index) {
	const alt = COLORWAYS[(index + 3) % COLORWAYS.length];
	const third = COLORWAYS[(index * 2 + 7) % COLORWAYS.length];
	return [.../* @__PURE__ */ new Set([
		palette,
		alt,
		third
	])];
}
var TEMPLATES = SECTIONS.flatMap((section, sectionIndex) => section.looks.flatMap((lookId, lookIndex) => {
	const look = LOOK[lookId];
	if (!look) throw new Error(`Unknown look ${lookId}`);
	return colorways(look.palette, sectionIndex + lookIndex).map((palette, paletteIndex) => {
		const variant = sectionIndex * 24 + lookIndex * 3 + paletteIndex;
		const colorName = palette === look.palette ? look.name : `${look.name} · ${PALETTES[palette].name}`;
		return {
			id: `${section.id}-${look.id}-${palette}`,
			name: `${colorName} ${section.noun}`,
			category: look.category,
			format: section.heading,
			sectionId: section.id,
			description: `${look.description} ${section.noun} layout, ${PALETTES[palette].name} color, ${look.motion.replace("-", " ")} motion, ${look.transition} cut, ${FRAME[variant % FRAME.length]}. 1080×1920.`,
			layout: look.layout,
			motion: look.motion,
			transition: look.transition,
			duration: look.duration + (lookIndex + paletteIndex) % 3,
			beats: BEATS[look.beats],
			palette,
			variant
		};
	});
}));
[...Array.from(new Set(LOOKS.map((look) => look.category)))];
function getTemplate(id) {
	return TEMPLATES.find((template) => template.id === id);
}
function sectionsFor(tab) {
	if (tab === "for-you") return SECTIONS.filter((section) => section.featured);
	return SECTIONS.filter((section) => section.tab === tab);
}
function templatesIn(sectionId) {
	return TEMPLATES.filter((template) => template.sectionId === sectionId);
}
var FONTS = [
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
	"Noto Sans Gurmukhi"
];
var LANGS = {
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
	Punjabi: "ਜੈ ਸ਼੍ਰੀ ਮਹਾਕਾਲ"
};
var NAV = [
	{
		id: "media",
		label: "Media",
		icon: Images
	},
	{
		id: "templates",
		label: "Templates",
		icon: LayoutTemplate
	},
	{
		id: "music",
		label: "Music",
		icon: Music
	},
	{
		id: "type",
		label: "Type",
		icon: Type
	},
	{
		id: "preview",
		label: "Preview",
		icon: Clapperboard
	}
];
function TemplateCard({ template, active, assets, title, fontFamily, fontScale, speed, duration, tick, bitmap, onUse }) {
	const ref = (0, import_react.useRef)(null);
	const cardRef = (0, import_react.useRef)(null);
	const [seen, setSeen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const node = cardRef.current;
		if (!node || seen) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) setSeen(true);
		}, { rootMargin: "240px" });
		observer.observe(node);
		return () => observer.disconnect();
	}, [seen]);
	(0, import_react.useEffect)(() => {
		if (!seen) return;
		const canvas = ref.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		canvas.width = 180;
		canvas.height = 320;
		const scenes = buildScenes(template, assets.length ? assets : demoAssets(desiredSlots(template)));
		try {
			paintFrame(ctx, {
				template,
				scenes,
				time: (duration || template.duration) / Math.max(1, scenes.length) * .42,
				duration: duration || template.duration,
				speed,
				title,
				fontFamily,
				fontScale,
				demo: assets.length === 0,
				strict: false,
				bitmap
			});
		} catch {}
	}, [
		seen,
		template,
		assets,
		title,
		fontFamily,
		fontScale,
		speed,
		duration,
		tick,
		bitmap
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		ref: cardRef,
		className: active ? "tcard chosen" : "tcard",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "thumbHit",
				type: "button",
				onClick: onUse,
				"aria-label": `Customize ${template.name}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref,
					className: "thumb",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "thumbAction",
					children: active ? "Selected" : "Customize"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: template.name }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [template.format, " · 1080×1920"] })
		]
	});
}
function Studio() {
	const [workspace, setWorkspace] = (0, import_react.useState)("templates");
	const [query, setQuery] = (0, import_react.useState)("Navratri");
	const [status, setStatus] = (0, import_react.useState)("Search a festival, deity, place, or tradition.");
	const [statusBad, setStatusBad] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [nextOffset, setNextOffset] = (0, import_react.useState)(null);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [mediaTab, setMediaTab] = (0, import_react.useState)("all");
	const [templateId, setTemplateId] = (0, import_react.useState)(TEMPLATES[0].id);
	const [templateTab, setTemplateTab] = (0, import_react.useState)("for-you");
	const [openSection, setOpenSection] = (0, import_react.useState)(null);
	const [templateQuery, setTemplateQuery] = (0, import_react.useState)("");
	const [speed, setSpeed] = (0, import_react.useState)("medium");
	const [duration, setDuration] = (0, import_react.useState)(TEMPLATES[0].duration);
	const [title, setTitle] = (0, import_react.useState)("");
	const [fontFamily, setFontFamily] = (0, import_react.useState)("Auto");
	const [fontScale, setFontScale] = (0, import_react.useState)(1);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [progress, setProgress] = (0, import_react.useState)("");
	const [qc, setQc] = (0, import_react.useState)("Select media and a template, then Build Preview.");
	const [scenes, setScenes] = (0, import_react.useState)([]);
	const [thumbTick, setThumbTick] = (0, import_react.useState)(0);
	const [downloadReady, setDownloadReady] = (0, import_react.useState)(false);
	const [templatePage, setTemplatePage] = (0, import_react.useState)(24);
	const [musicQuery, setMusicQuery] = (0, import_react.useState)("indian classical");
	const [tracks, setTracks] = (0, import_react.useState)([]);
	const [musicStatus, setMusicStatus] = (0, import_react.useState)("Search licensed catalogs, or import a file you have rights to.");
	const [music, setMusic] = (0, import_react.useState)(null);
	const [musicStart, setMusicStart] = (0, import_react.useState)(0);
	const [musicEnd, setMusicEnd] = (0, import_react.useState)(15);
	const template = getTemplate(templateId) ?? TEMPLATES[0];
	const selectedRef = (0, import_react.useRef)(selected);
	const templateRef = (0, import_react.useRef)(template);
	const speedRef = (0, import_react.useRef)(speed);
	const durationRef = (0, import_react.useRef)(duration);
	const titleRef = (0, import_react.useRef)(title);
	const fontRef = (0, import_react.useRef)(fontFamily);
	const scaleRef = (0, import_react.useRef)(fontScale);
	const musicRef = (0, import_react.useRef)(music);
	const trimRef = (0, import_react.useRef)({
		start: musicStart,
		end: musicEnd
	});
	const loadedRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const thumbsRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const canvasRef = (0, import_react.useRef)(null);
	const runId = (0, import_react.useRef)(0);
	const playToken = (0, import_react.useRef)(0);
	const playingRef = (0, import_react.useRef)(false);
	const readyRef = (0, import_react.useRef)(false);
	const demoRef = (0, import_react.useRef)(false);
	const buildingRef = (0, import_react.useRef)(false);
	const rafRef = (0, import_react.useRef)(0);
	const scenesRef = (0, import_react.useRef)([]);
	const sceneMark = (0, import_react.useRef)(-1);
	const searchGen = (0, import_react.useRef)(0);
	const audioRef = (0, import_react.useRef)(null);
	const bitmapRef = (0, import_react.useRef)(() => null);
	(0, import_react.useEffect)(() => {
		selectedRef.current = selected;
	}, [selected]);
	(0, import_react.useEffect)(() => {
		templateRef.current = template;
	}, [template]);
	(0, import_react.useEffect)(() => {
		speedRef.current = speed;
	}, [speed]);
	(0, import_react.useEffect)(() => {
		durationRef.current = duration;
	}, [duration]);
	(0, import_react.useEffect)(() => {
		titleRef.current = title;
	}, [title]);
	(0, import_react.useEffect)(() => {
		fontRef.current = fontFamily;
	}, [fontFamily]);
	(0, import_react.useEffect)(() => {
		scaleRef.current = fontScale;
	}, [fontScale]);
	(0, import_react.useEffect)(() => {
		musicRef.current = music;
		trimRef.current = {
			start: musicStart,
			end: musicEnd
		};
	}, [
		music,
		musicStart,
		musicEnd
	]);
	(0, import_react.useEffect)(() => {
		setTemplatePage(24);
	}, [
		templateTab,
		openSection,
		templateQuery
	]);
	(0, import_react.useEffect)(() => {
		if (workspace !== "preview" || readyRef.current || playingRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		canvas.width = 1080;
		canvas.height = 1920;
		paintFrame(ctx, paintInput(0, false));
	}, [workspace]);
	const bitmap = (0, import_react.useMemo)(() => {
		const fn = (asset) => {
			if (asset.demo) return null;
			const loaded = loadedRef.current.get(asset.id);
			if (loaded?.image) return loaded.image;
			if (loaded?.video && loaded.video.readyState >= 2) return loaded.video;
			return thumbsRef.current.get(asset.id) ?? null;
		};
		bitmapRef.current = fn;
		return fn;
	}, [thumbTick]);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		const pending = selected.filter((asset) => !asset.demo && !thumbsRef.current.has(asset.id) && (asset.thumb || asset.playUrl));
		if (!pending.length) return;
		(async () => {
			for (const asset of pending) try {
				const image = await loadThumb(asset);
				if (cancel) return;
				thumbsRef.current.set(asset.id, image);
				setThumbTick((value) => value + 1);
			} catch {}
		})();
		return () => {
			cancel = true;
		};
	}, [selected]);
	const visible = results.filter((asset) => mediaTab === "all" || asset.kind === mediaTab);
	const queryText = templateQuery.trim().toLowerCase();
	const searchHits = queryText ? TEMPLATES.filter((item) => `${item.name} ${item.format} ${item.category} ${item.description}`.toLowerCase().includes(queryText)) : [];
	const shelves = sectionsFor(templateTab);
	const focusSection = SECTIONS.find((section) => section.id === openSection) ?? null;
	const focusTemplates = focusSection ? templatesIn(focusSection.id) : [];
	const visibleSearch = searchHits.slice(0, templatePage);
	const visibleFocus = focusTemplates.slice(0, templatePage);
	const plan = (0, import_react.useMemo)(() => selected.length ? buildScenes(template, selected) : [], [selected, template]);
	function invalidateReady(message) {
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
	function paintInput(time, demo) {
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
			bitmap: (asset) => bitmapRef.current(asset)
		};
	}
	async function syncVideos(time) {
		const scenesNow = scenesRef.current;
		const spot = locate(time, sceneDurations(durationRef.current, scenesNow.length), (index) => transitionSeconds(templateRef.current.transition, speedRef.current, index));
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
			if (item.video.paused) try {
				await item.video.play();
			} catch {
				throw new Error(`${item.asset.title} could not start playback.`);
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
		audio.play().catch(() => setMusicStatus("Music preview could not start. The picture reel can still play."));
	}
	function startLoop(token, demo) {
		playingRef.current = true;
		setPhase("playing");
		const started = performance.now();
		sceneMark.current = -1;
		startAudio();
		const tick = () => {
			if (playToken.current !== token || !playingRef.current) return;
			const elapsed = (performance.now() - started) / 1e3 % Math.max(1, durationRef.current);
			(async () => {
				if (playToken.current !== token || !playingRef.current) return;
				try {
					if (!demo) await syncVideos(elapsed);
				} catch (error) {
					playingRef.current = false;
					readyRef.current = false;
					setPhase("failed");
					setQc(qcFail({
						template: templateRef.current.name,
						reason: error instanceof Error ? error.message : "Video playback failed.",
						fix: "Re-select the video or pick a photo."
					}));
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
	async function runBuild(options) {
		if (buildingRef.current) return false;
		const chosen = getTemplate(options.templateId || templateRef.current.id) ?? templateRef.current;
		templateRef.current = chosen;
		if (options.templateId) setTemplateId(chosen.id);
		const demo = options.demo;
		const assets = demo ? demoAssets(desiredSlots(chosen)) : selectedRef.current.slice();
		if (!demo && !assets.length) {
			setPhase("failed");
			setQc(qcFail({
				template: chosen.name,
				reason: "No media selected.",
				fix: "Select at least one photo or video."
			}));
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
				if (!asset.playUrl && !asset.url) throw new Error(qcFail({
					template: chosen.name,
					asset: asset.title,
					reason: "Selected asset has no playable file.",
					fix: "Re-select the asset."
				}));
			}
			const nextScenes = buildScenes(chosen, assets);
			if (!nextScenes.length) throw new Error(qcFail({
				template: chosen.name,
				reason: "Selected media could not create scenes.",
				fix: "Select a photo or video and try again."
			}));
			const allowed = new Set(assets.map((asset) => asset.id));
			nextScenes.forEach((scene, index) => {
				if (!scene.assets.length) throw new Error(qcFail({
					scene: index + 1,
					template: chosen.name,
					reason: "Scene has no selected asset.",
					fix: "Re-select media."
				}));
				for (const asset of scene.assets) if (!allowed.has(asset.id)) throw new Error(qcFail({
					scene: index + 1,
					template: chosen.name,
					asset: asset.title,
					reason: "Scene referenced media that was not selected.",
					fix: "Build again. Nothing is substituted automatically."
				}));
			});
			if (!demo && !coversSelection(nextScenes, assets)) throw new Error(qcFail({
				template: chosen.name,
				reason: "Not every selected asset was placed in the reel.",
				fix: "Build again."
			}));
			if (!alive()) return false;
			if (!demo) {
				const keep = new Set(assets.map((asset) => asset.id));
				for (const [id, item] of loadedRef.current) if (!keep.has(id)) {
					releaseVideo(item.video);
					loadedRef.current.delete(id);
				}
				for (let index = 0; index < assets.length; index++) {
					const asset = assets[index];
					setProgress(`Loading assets… ${index + 1}/${assets.length}`);
					if (!loadedRef.current.has(asset.id)) try {
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
						throw new Error(qcFail({
							scene: scene ? scene.index + 1 : void 0,
							template: chosen.name,
							asset: asset.title,
							reason: error instanceof Error ? error.message : "Media failed to load.",
							fix: "Re-select the asset."
						}));
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
			if (!canvas || !ctx) throw new Error(qcFail({
				template: chosen.name,
				reason: "Preview canvas is not available.",
				fix: "Open Preview and build again."
			}));
			canvas.width = 1080;
			canvas.height = 1920;
			setProgress("Rendering first frame…");
			sceneMark.current = -1;
			if (!demo) await syncVideos(0);
			if (!alive()) return false;
			const painted = paintFrame(ctx, {
				...paintInput(.05, demo),
				template: chosen,
				scenes: nextScenes
			});
			if (painted.missingTitle || !painted.drewMedia) throw new Error(qcFail({
				scene: painted.sceneIndex + 1,
				template: chosen.name,
				asset: painted.missingTitle,
				reason: "First frame did not draw the selected media.",
				fix: "Re-select the asset."
			}));
			if (!frameHasContent(ctx)) throw new Error(qcFail({
				template: chosen.name,
				reason: "First frame rendered blank.",
				fix: "Re-select the media and build again."
			}));
			if (!alive()) return false;
			setProgress("Running QC…");
			readyRef.current = true;
			demoRef.current = demo;
			const photos = assets.filter((asset) => asset.kind === "image").length;
			const videos = assets.filter((asset) => asset.kind === "video").length;
			setQc([
				"READY",
				"",
				`Template: ${chosen.name}`,
				`Scenes: ${nextScenes.length}`,
				`Canvas: 1080×1920`,
				demo ? "Media: labeled demo plates" : `Media: ${photos} photo${photos === 1 ? "" : "s"}, ${videos} video${videos === 1 ? "" : "s"}`,
				"First frame: rendered",
				"Playback: ready"
			].join("\n"));
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
			setQc(error instanceof Error ? error.message : qcFail({
				reason: "Build failed.",
				fix: "Try again."
			}));
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
			const data = await (await fetch(`/api/media-search?q=${encodeURIComponent(q)}&offset=${offset}`)).json();
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
	function toggleAsset(asset) {
		const next = selectedRef.current.some((item) => item.id === asset.id) ? selectedRef.current.filter((item) => item.id !== asset.id) : selectedRef.current.concat(asset);
		setSelected(next);
		selectedRef.current = next;
		invalidateReady("Selection changed. Build Preview to render this cut.");
	}
	function applyTemplate(id, preview) {
		const chosen = getTemplate(id);
		if (!chosen) return;
		setTemplateId(id);
		templateRef.current = chosen;
		const nextDuration = durationFor(chosen, speedRef.current);
		setDuration(nextDuration);
		durationRef.current = nextDuration;
		setWorkspace("preview");
		if (preview) {
			runBuild({
				autoplay: true,
				demo: selectedRef.current.length === 0,
				templateId: id
			});
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
			setQc(qcFail({
				reason: "Export needs selected media.",
				fix: "Select at least one photo or video, then Build Preview."
			}));
			setWorkspace("media");
			return;
		}
		setWorkspace("preview");
		onStop();
		if (!await runBuild({
			autoplay: false,
			demo: false
		}) || !readyRef.current) return;
		const canvas = canvasRef.current;
		if (!canvas || typeof canvas.captureStream !== "function") {
			setQc(qcFail({
				reason: "This browser cannot capture the canvas.",
				fix: "Use a current version of Chrome, Edge, or Firefox."
			}));
			return;
		}
		const token = ++playToken.current;
		const stream = canvas.captureStream(30);
		let exportAudio = null;
		const track = musicRef.current;
		if (track?.audio) try {
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
		const mime = [
			"video/webm;codecs=vp8,opus",
			"video/webm;codecs=vp9,opus",
			"video/webm;codecs=vp8",
			"video/webm"
		].find((item) => MediaRecorder.isTypeSupported(item)) || "video/webm";
		let recorder;
		try {
			recorder = new MediaRecorder(stream, {
				mimeType: mime,
				videoBitsPerSecond: 8e6
			});
		} catch (error) {
			stream.getTracks().forEach((item) => item.stop());
			setQc(qcFail({
				reason: error instanceof Error ? error.message : "Recording is not available.",
				fix: "Try another browser."
			}));
			return;
		}
		const chunks = [];
		recorder.ondataavailable = (event) => {
			if (event.data.size) chunks.push(event.data);
		};
		const stopped = new Promise((resolve) => {
			recorder.onstop = () => resolve();
		});
		recorder.start(200);
		setPhase("building");
		const started = performance.now();
		const total = durationRef.current;
		sceneMark.current = -1;
		playingRef.current = true;
		while (playingRef.current && playToken.current === token) {
			const elapsed = (performance.now() - started) / 1e3;
			if (elapsed >= total) break;
			try {
				await syncVideos(elapsed);
			} catch (error) {
				playingRef.current = false;
				try {
					recorder.stop();
				} catch {}
				setPhase("failed");
				setQc(qcFail({
					template: templateRef.current.name,
					reason: error instanceof Error ? error.message : "Export frame failed.",
					fix: "Re-select the asset."
				}));
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
				} catch {}
				readyRef.current = false;
				setPhase("failed");
				setQc(qcFail({
					scene: painted.sceneIndex + 1,
					template: templateRef.current.name,
					asset: painted.missingTitle,
					reason: "A frame could not be rendered during export.",
					fix: "Re-select the asset and build again."
				}));
				stream.getTracks().forEach((item) => item.stop());
				return;
			}
			setProgress(`Creating reel… ${Math.min(99, Math.round(elapsed / total * 100))}%`);
			await new Promise((resolve) => requestAnimationFrame(() => resolve(void 0)));
		}
		const ctx = canvas.getContext("2d");
		if (ctx) paintFrame(ctx, paintInput(Math.max(0, total - .001), false));
		exportAudio?.pause();
		for (const item of loadedRef.current.values()) item.video?.pause();
		recorder.stop();
		await stopped;
		stream.getTracks().forEach((item) => item.stop());
		const webm = new Blob(chunks, { type: mime });
		if (webm.size < 1024) {
			setPhase("failed");
			setQc(qcFail({
				reason: "Recording was empty.",
				fix: "Build Preview again, then export."
			}));
			return;
		}
		setProgress("Converting to MP4 / H.264…");
		const slug = templateRef.current.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
		try {
			const converted = await fetch("/api/convert-mp4", {
				method: "POST",
				headers: { "content-type": "video/webm" },
				body: webm,
				signal: AbortSignal.timeout(3e5)
			});
			if (!converted.ok) {
				const detail = await converted.text();
				throw new Error(detail.slice(0, 240) || `Server returned ${converted.status}`);
			}
			if (!(converted.headers.get("content-type") || "").includes("video/mp4")) throw new Error("Server did not return video/mp4");
			const mp4 = await converted.blob();
			const head = new Uint8Array(await mp4.slice(0, 32).arrayBuffer());
			if (String.fromCharCode(...head.slice(4, 8)) !== "ftyp") throw new Error("Converted file is not a valid MP4");
			downloadBlob(mp4, `reel-${slug}.mp4`);
			readyRef.current = true;
			setPhase("ready");
			setProgress("Ready");
			setQc(`READY\n\nExport verified\nMP4 / H.264\n1080×1920 · 30 FPS\n${Math.round(mp4.size / 1024)} KB\nTemplate: ${templateRef.current.name}`);
		} catch (error) {
			downloadBlob(webm, `reel-${slug}.webm`);
			setPhase("failed");
			setProgress("");
			setQc(qcFail({
				template: templateRef.current.name,
				reason: `MP4 conversion failed (${error instanceof Error ? error.message : "unknown"}). A WebM backup was saved.`,
				fix: "Try export again. Instagram Edits needs the MP4."
			}));
		}
	}
	async function onMusicSearch() {
		const q = musicQuery.trim();
		if (!q) return;
		setMusicStatus("Searching licensed music…");
		try {
			const response = await fetch(`/api/music-search?q=${encodeURIComponent(q)}`);
			const data = await response.json();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "studio",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "rail",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand",
					children: ["Festival of Bharat", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Reel studio" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: NAV.map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: workspace === item.id ? "active" : "",
						type: "button",
						onClick: () => setWorkspace(item.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 }), item.label]
					}, item.id);
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "desk",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "topbar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Festival of Bharat Studio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "lede",
							children: "Browse templates by category, pick one, then build it with your media."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary",
							type: "button",
							disabled: phase === "building",
							onClick: () => {
								setWorkspace("preview");
								runBuild({
									autoplay: true,
									demo: false
								});
							},
							children: phase === "building" ? "BUILDING…" : "Build Preview"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "stats",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "stat",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Photos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: photoCount })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "stat",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Videos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: videoCount })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "stat",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Selected" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selected.length })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "stat",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Template" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: template.name })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "work",
						children: [
							workspace === "media" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "panel",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "searchRow",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											value: query,
											"aria-label": "Search media",
											onChange: (event) => setQuery(event.target.value),
											onKeyDown: (event) => {
												if (event.key === "Enter") onSearch(0);
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "primary",
											type: "button",
											disabled: searching,
											onClick: () => void onSearch(0),
											children: searching ? "Searching…" : "Search"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: statusBad ? "status bad" : "status",
										children: status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "ghost",
												type: "button",
												onClick: () => document.getElementById("file-input")?.click(),
												children: "Upload"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "ghost",
												type: "button",
												onClick: () => {
													const additions = visible.filter((asset) => !selected.some((item) => item.id === asset.id));
													if (!additions.length) return;
													const next = selected.concat(additions);
													setSelected(next);
													selectedRef.current = next;
													invalidateReady("Selection changed. Build Preview to render this cut.");
												},
												children: "Select visible"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "danger",
												type: "button",
												onClick: () => {
													setSelected([]);
													selectedRef.current = [];
													invalidateReady("Selection cleared.");
												},
												children: "Clear"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "file-input",
												className: "hiddenInput",
												type: "file",
												accept: "image/*,video/*",
												multiple: true,
												onChange: (event) => {
													const imported = [...event.target.files || []].map((file) => {
														const url = URL.createObjectURL(file);
														return {
															id: `local-${crypto.randomUUID()}`,
															title: file.name,
															source: "Local upload",
															kind: file.type.startsWith("video/") ? "video" : "image",
															url,
															thumb: url,
															playUrl: url,
															local: true
														};
													});
													setResults((current) => imported.concat(current));
													setStatus(imported.length ? `${imported.length} file${imported.length === 1 ? "" : "s"} imported. Select each one to use it.` : status);
													event.target.value = "";
												}
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "tabs",
										children: [
											["all", "All"],
											["image", "Photos"],
											["video", "Videos"]
										].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: mediaTab === id ? "tab active" : "tab",
											type: "button",
											onClick: () => setMediaTab(id),
											children: label
										}, id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mediaLayout",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "note",
												children: "No cards yet. Search Wikimedia, or upload from this device."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "cards",
												children: visible.map((asset) => {
													const on = selected.some((item) => item.id === asset.id);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
														className: on ? "card chosen" : "card",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaVisual, { asset }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
																title: asset.title,
																children: asset.title
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "meta",
																children: [
																	asset.source,
																	" · ",
																	asset.kind === "video" ? "Video" : "Photo",
																	asset.width ? ` · ${asset.width}×${asset.height || ""}` : ""
																]
															}),
															asset.license ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "meta",
																children: asset.license
															}) : null,
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "row",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	className: on ? "primary" : "ghost",
																	type: "button",
																	onClick: () => toggleAsset(asset),
																	children: on ? "Selected" : "Select"
																}), asset.pageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
																	className: "ghost",
																	href: asset.pageUrl,
																	target: "_blank",
																	rel: "noreferrer",
																	children: "Source"
																}) : null]
															})
														]
													}, asset.id);
												})
											}),
											nextOffset !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "row",
												style: { marginTop: 12 },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "ghost",
													type: "button",
													disabled: searching,
													onClick: () => void onSearch(nextOffset),
													children: "Load more results"
												})
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
											className: "panel",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["Selected · ", selected.length] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "trace",
												children: [selected.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "note",
													children: "Nothing is selected. The reel will not pull media on its own."
												}), selected.map((asset, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [asset.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "ghost",
													type: "button",
													onClick: () => toggleAsset(asset),
													children: "Remove"
												})] })] }, asset.id))]
											})]
										})]
									})
								]
							}),
							workspace === "templates" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "panel templates",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Templates" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "note",
											children: [TEMPLATES.length, " templates · 1080×1920"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "searchRow",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											value: templateQuery,
											"aria-label": "Search templates",
											placeholder: "Search templates — Instagram Reel, poster, wedding, quote…",
											onChange: (event) => {
												setTemplateQuery(event.target.value);
												setOpenSection(null);
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "tabs",
										role: "tablist",
										"aria-label": "Template categories",
										children: TEMPLATE_TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: templateTab === item.id && !queryText ? "tab active" : "tab",
											type: "button",
											role: "tab",
											"aria-selected": templateTab === item.id && !queryText,
											onClick: () => {
												setTemplateTab(item.id);
												setOpenSection(null);
												setTemplateQuery("");
											},
											children: item.label
										}, item.id))
									}),
									queryText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shelfHead",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
												"Results for “",
												templateQuery.trim(),
												"”"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "note",
												children: searchHits.length
											})]
										}),
										searchHits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "note",
											children: "No templates match that search. Try reel, story, poster, wedding, or quote."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "gallery",
											children: visibleSearch.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplateCard, {
												template: item,
												active: item.id === template.id,
												assets: selected,
												title,
												fontFamily,
												fontScale,
												speed,
												duration,
												tick: thumbTick,
												bitmap,
												onUse: () => applyTemplate(item.id, true)
											}, item.id))
										}),
										searchHits.length > visibleSearch.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "ghost",
											type: "button",
											onClick: () => setTemplatePage((count) => count + 24),
											children: [
												"Show more (",
												searchHits.length - visibleSearch.length,
												" left)"
											]
										})
									] }) : focusSection ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shelfHead",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: focusSection.heading }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "textBtn",
												type: "button",
												onClick: () => setOpenSection(null),
												children: ["All ", TEMPLATE_TABS.find((item) => item.id === templateTab)?.label]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "tabs",
											children: shelves.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: section.id === focusSection.id ? "tab active" : "tab",
												type: "button",
												onClick: () => setOpenSection(section.id),
												children: section.heading
											}, section.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "gallery",
											children: visibleFocus.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplateCard, {
												template: item,
												active: item.id === template.id,
												assets: selected,
												title,
												fontFamily,
												fontScale,
												speed,
												duration,
												tick: thumbTick,
												bitmap,
												onUse: () => applyTemplate(item.id, true)
											}, item.id))
										}),
										focusTemplates.length > visibleFocus.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "ghost",
											type: "button",
											onClick: () => setTemplatePage((count) => count + 24),
											children: [
												"Show more (",
												focusTemplates.length - visibleFocus.length,
												" left)"
											]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "tabs headingTabs",
										children: shelves.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "tab",
											type: "button",
											onClick: () => setOpenSection(section.id),
											children: section.heading
										}, section.id))
									}), shelves.map((section) => {
										const cards = templatesIn(section.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shelf",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "shelfHead",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: section.heading }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "textBtn",
													type: "button",
													onClick: () => setOpenSection(section.id),
													children: "See all"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "shelfRow",
												children: cards.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplateCard, {
													template: item,
													active: item.id === template.id,
													assets: selected,
													title,
													fontFamily,
													fontScale,
													speed,
													duration,
													tick: thumbTick,
													bitmap,
													onUse: () => applyTemplate(item.id, true)
												}, item.id))
											})]
										}, section.id);
									})] })
								]
							}),
							workspace === "music" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "panel",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "searchRow",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											value: musicQuery,
											"aria-label": "Search music",
											onChange: (event) => setMusicQuery(event.target.value),
											onKeyDown: (event) => {
												if (event.key === "Enter") onMusicSearch();
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "primary",
											type: "button",
											onClick: () => void onMusicSearch(),
											children: "Search"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "status",
										children: musicStatus
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "ghost",
												type: "button",
												onClick: () => document.getElementById("music-input")?.click(),
												children: "Import audio"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "note",
												children: ["Start", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "field",
													type: "number",
													min: 0,
													value: musicStart,
													onChange: (event) => setMusicStart(Number(event.target.value) || 0)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "note",
												children: ["End", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "field",
													type: "number",
													min: 0,
													value: musicEnd,
													onChange: (event) => setMusicEnd(Number(event.target.value) || 0)
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "music-input",
										className: "hiddenInput",
										type: "file",
										accept: "audio/*",
										onChange: (event) => {
											const file = event.target.files?.[0];
											if (!file) return;
											const url = URL.createObjectURL(file);
											const trackItem = {
												id: `local-${Date.now()}`,
												name: file.name,
												artist_name: "Imported",
												duration: 0,
												audio: url,
												source: "Local",
												local: true
											};
											setMusic(trackItem);
											setMusicStatus(`Imported ${file.name}. Final Instagram music should still be added in Edits if the post needs their library.`);
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "music",
										children: tracks.map((track) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: music?.id === track.id ? "track selected" : "track",
											children: [
												track.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: track.thumbnail,
													alt: ""
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "note",
													children: track.source
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: track.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "note",
													children: [
														track.artist_name,
														" · ",
														track.source,
														track.duration ? ` · ${track.duration}s` : ""
													]
												})] }),
												track.audio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "ghost",
													type: "button",
													onClick: () => {
														setMusic(track);
														setMusicEnd(Math.min(duration, track.duration || duration));
														setMusicStatus(`Selected ${track.name}`);
													},
													children: music?.id === track.id ? "Selected" : "Select"
												}) : track.landing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													className: "ghost",
													href: track.landing,
													target: "_blank",
													rel: "noreferrer",
													children: "Open"
												}) : null
											]
										}, track.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "note",
										children: "Instagram’s licensed library is not downloaded here. Add that music in Instagram Edits after you export the picture master."
									})
								]
							}),
							workspace === "type" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "panel",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "slider",
										children: ["Caption", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											value: title,
											placeholder: "Caption on the reel",
											onChange: (event) => setTitle(event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "tabs",
										children: Object.keys(LANGS).map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "tab",
											type: "button",
											onClick: () => setTitle(LANGS[lang] || ""),
											children: lang
										}, lang))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "slider",
										children: ["Font", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "select",
											value: fontFamily,
											onChange: (event) => setFontFamily(event.target.value),
											children: Array.from(/* @__PURE__ */ new Set([...FONTS, fontFamily])).map((font) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: font }, font))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "slider",
										children: [
											"Size ",
											Math.round(fontScale * 100),
											"%",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: .8,
												max: 1.25,
												step: .01,
												value: fontScale,
												onChange: (event) => setFontScale(Number(event.target.value))
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "note",
										children: "The caption is the only title drawn on the picture. Leave it blank for no title. The studio name is never written on the reel. Long names wrap and scale down instead of leaving the frame."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "ghost",
										type: "button",
										onClick: () => document.getElementById("font-input")?.click(),
										children: "Upload font"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "font-input",
										className: "hiddenInput",
										type: "file",
										accept: ".ttf,.otf,.woff,.woff2",
										onChange: async (event) => {
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
										}
									})
								]
							}),
							workspace === "preview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "previewLayout",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "panel",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: template.name }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "note",
											children: template.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "status",
											children: progress || phase
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "tabs",
											children: [
												"slow",
												"medium",
												"fast",
												"mixed"
											].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: speed === item ? "tab active" : "tab",
												type: "button",
												onClick: () => {
													setSpeed(item);
													const next = durationFor(template, item);
													setDuration(next);
													durationRef.current = next;
													if (readyRef.current) invalidateReady("Speed changed. Build Preview again so timing matches.");
												},
												children: item
											}, item))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "slider",
											children: [
												"Duration ",
												duration,
												"s",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: 8,
													max: 40,
													value: duration,
													onChange: (event) => {
														const next = Number(event.target.value);
														setDuration(next);
														durationRef.current = next;
														if (readyRef.current) invalidateReady("Duration changed. Build Preview again.");
													}
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "row",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "primary",
													type: "button",
													disabled: phase === "building",
													onClick: () => void runBuild({
														autoplay: true,
														demo: false
													}),
													children: phase === "building" ? "BUILDING…" : "Build"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "ghost",
													type: "button",
													onClick: () => {
														if (readyRef.current) startLoop(++playToken.current, demoRef.current);
														else runBuild({
															autoplay: true,
															demo: selected.length === 0
														});
													},
													children: "Play"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "ghost",
													type: "button",
													onClick: onStop,
													children: "Stop"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "primary",
													type: "button",
													disabled: !downloadReady || phase === "building",
													onClick: () => void onExport(),
													children: phase === "building" && downloadReady ? "Preparing download…" : "Download reel"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "qc",
											children: qc
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "trace",
											children: (scenes.length ? scenes : plan).map((scene) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: String(scene.index + 1).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												scene.label,
												" — ",
												scene.assets.map((asset) => asset.title).join(" · ")
											] })] }, `${scene.index}-${scene.assets.map((asset) => asset.id).join("-")}`))
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "panel",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "phone",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
											ref: canvasRef,
											width: 1080,
											height: 1920
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "downloadBar",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "primary",
											type: "button",
											disabled: !downloadReady || phase === "building",
											onClick: () => void onExport(),
											children: phase === "building" && downloadReady ? "Preparing download…" : "Download reel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "note",
											children: downloadReady ? "Preview is ready. Download saves this exact 1080×1920 reel as an MP4." : "Build Preview first. Download turns on only after the reel is actually ready."
										})]
									})]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "dock",
				children: NAV.map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: workspace === item.id ? "active" : "",
						type: "button",
						onClick: () => setWorkspace(item.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 }), item.label]
					}, item.id);
				})
			})
		]
	});
}
function MediaVisual({ asset }) {
	const [src, setSrc] = (0, import_react.useState)(asset.local ? asset.thumb : asset.thumb || asset.playUrl);
	if (asset.kind === "video" && asset.local) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		src: asset.playUrl,
		muted: true,
		playsInline: true,
		preload: "metadata"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		onError: () => {
			const fallback = proxied(asset.thumb || asset.playUrl || asset.url);
			if (src !== fallback) setSrc(fallback);
		}
	});
}
function downloadBlob(blob, filename) {
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);
	link.href = url;
	link.download = filename;
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 3e4);
}
function Home() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "boot",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "bootKicker",
				children: "Festival of Bharat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Reel studio" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening the desk…" })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
