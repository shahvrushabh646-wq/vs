import { createFileRoute } from "@tanstack/react-router";
import { searchMusic } from "@/lib/reel/music.server";

export const Route = createFileRoute("/api/music-search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const query = new URL(request.url).searchParams.get("q") || "";
        try {
          const body = await searchMusic(query);
          return new Response(JSON.stringify(body), {
            status: 200,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Music search failed";
          return new Response(JSON.stringify({ error: message, results: [] }), {
            status: 502,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        }
      },
    },
  },
});
