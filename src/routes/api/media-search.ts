import { createFileRoute } from "@tanstack/react-router";
import { searchMedia } from "@/lib/reel/search.server";

export const Route = createFileRoute("/api/media-search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get("q") || "";
        const offset = Math.max(0, Number(url.searchParams.get("offset") || 0) || 0);
        try {
          const body = await searchMedia(query, offset);
          const status = body.results.length ? 200 : body.errors.length && !body.message?.startsWith("No suitable") ? 502 : 200;
          return new Response(JSON.stringify(body), {
            status,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Search failed";
          return new Response(JSON.stringify({ error: `Wikimedia search failed — ${message}`, results: [], errors: [message] }), {
            status: 502,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        }
      },
    },
  },
});
