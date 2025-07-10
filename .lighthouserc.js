module.exports = {
  ci: {
    collect: {
      staticDistDir: "./build", // используется при проверке локальной сборки
      url: ["https://promelektroservice-react-structure.vercel.app/"], // проверка продакшн-версии
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        disableStorageReset: true, // сохраняем localStorage, sessionStorage и cookies
        throttlingMethod: "simulate", // эмуляция скорости сети и CPU
        waitForTimeout: 5000 // ждём 5 секунд после загрузки страницы перед началом аудита
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
        "categories:pwa": "off" // отключено, так как сайт не является PWA
      }
    }
  }
};
