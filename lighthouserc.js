module.exports = {
  ci: {
    collect: {
      // Start local server before collecting
      startServerCommand: "pnpm --filter @fragment_ui/www start",
      startServerReadyPattern: "ready",
      startServerReadyTimeout: 30000,
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
    },
    assert: {
      // Performance budgets
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.8 }],
        // Core Web Vitals
        "first-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],
        "speed-index": ["error", { maxNumericValue: 3000 }],
        // Resource budgets
        "total-byte-weight": ["error", { maxNumericValue: 5000000 }], // 5MB
        "dom-size": ["error", { maxNumericValue: 1500 }],
      },
    },
    upload: {
      // Optional: Upload to Lighthouse CI server
      target: "temporary-public-storage",
    },
  },
};

