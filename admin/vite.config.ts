import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A genuinely separate, purely front-end Vite app: its own index.html, its
// own React root, its own bundle — no backend, no server calls. Built to
// public/admin/blog/ so the main app's static-asset serving resolves the
// spec's literal /admin/blog URL straight to this index.html (directory-index
// resolution) with no server-side rewrite needed. Sub-views (/new, /edit/:id)
// are hash routes off that one page (see App.tsx) — the hash never reaches
// the server, so a hard refresh on any of them still resolves the same way.
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
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "../public/admin/blog"),
    emptyOutDir: true,
  },
}));
