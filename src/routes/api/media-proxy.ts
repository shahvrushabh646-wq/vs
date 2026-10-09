import { createFileRoute } from "@tanstack/react-router";
import { proxyMedia } from "@/lib/reel/proxy.server";

const handle = ({ request }: { request: Request }) => proxyMedia(request);

export const Route = createFileRoute("/api/media-proxy")({
  server: { handlers: { GET: handle, HEAD: handle } },
});
