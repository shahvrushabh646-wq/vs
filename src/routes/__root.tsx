import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Festival of Bharat Studio";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "Search real festival media, choose a reel template, and export a 1080×1920 cut." },
      { name: "theme-color", content: "#0b0d10" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,500&family=Playfair+Display:ital,wght@0,500;0,700;1,600&family=Noto+Sans:wght@500;700&family=Noto+Sans+Bengali:wght@600;700&family=Noto+Sans+Devanagari:wght@600;700&family=Noto+Sans+Gujarati:wght@600;700&family=Noto+Sans+Gurmukhi:wght@600;700&family=Noto+Sans+Kannada:wght@600;700&family=Noto+Sans+Malayalam:wght@600;700&family=Noto+Sans+Tamil:wght@600;700&family=Noto+Sans+Telugu:wght@600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
