module.exports = {
  ci: {
    collect: {
      url: ["https://promelektroservice-react-structure.vercel.app/"],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        disableStorageReset: true,
        throttlingMethod: "simulate",
        waitForTimeout: 10000
      }
    },
    upload: {
      target: "filesystem",
      outputDir: "report"
      // ❌ НЕ указываем reportFilenamePattern
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.6 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:pwa": "off"
      }
    }
  }
};
