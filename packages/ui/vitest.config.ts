import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Optymalizacje wydajności
    threads: true, // Równoległe uruchamianie testów
    maxConcurrency: 5, // Maksymalna liczba równoległych testów
    testTimeout: 10000, // 10s timeout dla pojedynczego testu
    hookTimeout: 10000, // 10s timeout dla hooków
    teardownTimeout: 5000, // 5s timeout dla cleanup
    // Pool options dla lepszej wydajności
    // Use forks instead of threads to prevent hanging in CI
    pool: process.env.CI ? "forks" : "threads",
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
        isolate: true, // Izoluj każdy test w osobnym kontekście
      },
      forks: {
        singleFork: process.env.CI ? true : false, // Use single fork in CI for faster exit
        isolate: false, // Disable isolation in CI to allow process.exit to work
      },
    },
    // Coverage (opcjonalne, można włączyć później)
    coverage: {
      enabled: false,
    },
    // Force exit after tests complete (prevents hanging)
    forceRerunTriggers: [],
    // Ensure tests don't hang
    bail: 0,
    // Exit after tests complete
    watch: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

