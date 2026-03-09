import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query", "framer-motion"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query", "framer-motion"],
  },
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // UI library
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tabs", "@radix-ui/react-accordion"],
          // Data & forms
          "vendor-data": ["@tanstack/react-query", "react-hook-form", "@hookform/resolvers", "zod"],
          // Animation & charts
          "vendor-viz": ["framer-motion", "recharts"],
          // Supabase
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
    // Enable minification
    minify: "esbuild",
    // Target modern browsers
    target: "es2020",
    // Enable source maps for production debugging
    sourcemap: false,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
}));
