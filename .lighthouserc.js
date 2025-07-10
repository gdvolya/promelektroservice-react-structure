module.exports = {
  ci: {
    collect: {
      url: ["https://promelektroservice-react-structure.vercel.app/"],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        disableStorageReset: true,
        throttlingMethod: "simulate",
        screenEmulation: { disabled: false },
        onlyCategories: ["performance", "accessibility", "seo", "best-practices"],
        waitForTimeout: 10000 // или увеличь до 15000, если SSR + анимации
      }
    },
    upload: {
      target: "filesystem",
      outputDir: "./report", // 💡 измени путь, чтобы точно не затерлось
      reportFilenamePattern: "report_%DATE%.html"
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
