// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Placeholder domain — find-and-replace `arachne.example.com` once the
// real domain is registered. Used for canonical URLs, sitemap, and OG tags.
export default defineConfig({
  site: "https://arachne.example.com",
  integrations: [sitemap()],
  // Static output (the default) — `astro build` emits plain HTML/CSS/JS
  // into `dist/`, which rsyncs straight into the nginx root. No SSR runtime.
});
