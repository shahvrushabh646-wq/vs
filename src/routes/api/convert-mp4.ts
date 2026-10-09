import { createFileRoute } from "@tanstack/react-router";
import { convertWebmToMp4 } from "@/lib/reel/convert.server";

const MAX = 180 * 1024 * 1024;

export const Route = createFileRoute("/api/convert-mp4")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const declared = Number(request.headers.get("content-length") || 0);
        if (declared > MAX) {
          return new Response(JSON.stringify({ error: "Video too large" }), { status: 413, headers: { "content-type": "application/json" } });
        }
        const data = new Uint8Array(await request.arrayBuffer());
        if (!data.byteLength) {
          return new Response(JSON.stringify({ error: "Empty video upload" }), { status: 400, headers: { "content-type": "application/json" } });
        }
        if (data.byteLength > MAX) {
          return new Response(JSON.stringify({ error: "Video too large" }), { status: 413, headers: { "content-type": "application/json" } });
        }
        try {
          const mp4 = Buffer.from(await convertWebmToMp4(data));
          return new Response(mp4, {
            status: 200,
            headers: {
              "content-type": "video/mp4",
              "content-length": String(mp4.byteLength),
              "content-disposition": 'attachment; filename="reel.mp4"',
              "cache-control": "no-store",
              "x-reel-format": "1080x1920 H.264 yuv420p 30fps",
            },
          });
        } catch (error) {
          const detail = error instanceof Error ? error.message : "MP4 conversion failed";
          return new Response(JSON.stringify({ error: "MP4 conversion failed", detail }), {
            status: 500,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        }
      },
    },
  },
});
