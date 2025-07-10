module.exports = {
  ci: {
    collect: {
      staticDistDir: "./build",
      url: ["https://promelektroservice-react-structure.vercel.app/"],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        disableStorageReset: true, // Сохраняет состояние между прогонами
        throttlingMethod: "simulate", // Стандартное моделирование сети
        waitForTimeout: 5000 // ⏱ Ждём 5 секунд перед началом аудита
      }
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci/report",
      reportFilenamePattern: "promelektroservice_%-date%.report.html"
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
