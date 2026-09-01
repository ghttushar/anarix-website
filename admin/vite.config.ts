import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A genuinely separate Vite app: its own index.html, its own React root, its
// own bundle — no dependency on the TanStack Start app's SSR pipeline. Built
// to public/admin/blog/ so the main app's static-asset serving resolves the
// spec's literal /admin/blog URL straight to this index.html (directory-index
// resolution) with no server-side rewrite needed. Sub-views (/new, /edit/:id)
// are hash routes off that one page (see App.tsx) — the hash never reaches
// the server, so a hard refresh on any of them still resolves the same way.
// In dev it runs on its own port and proxies /api to the main app's dev
// server (see package.json's `dev:admin`).
export default defineConfig(({ command }) => ({
  root: import.meta.dirname,
  base: command === "build" ? "/admin/blog/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@blog-shared": path.resolve(import.meta.dirname, "../shared/blog"),
    },
  },
  server: {
    port: 8081,
    proxy: {
      "/api": "http://localhost:8080",
      "/uploads": "http://localhost:8080",
      // Lets the in-admin preview frame load the real public renderer via a
      // same-origin-looking relative URL in both dev (proxied here) and prod
      // (genuinely same-origin once built into public/admin/).
      "/blog": "http://localhost:8080",
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "../public/admin/blog"),
    emptyOutDir: true,
  },
}));
