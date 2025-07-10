const fs = require("fs");
const path = require("path");

// Папки с отчётами
const paths = {
  lighthouseci: path.join(__dirname, "..", ".lighthouseci"),
  lighthouseciReport: path.join(__dirname, "..", ".lighthouseci", "report"),
  report: path.join(__dirname, "..", "report"),
  publicReport: path.join(__dirname, "..", "public", "report"),
};

// Удаление всех .html и .json, кроме index.html
for (const dir of Object.values(paths)) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file);
    const keep = file === "index.html";
    if ((ext === ".html" || ext === ".json") && !keep) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

// Убедимся, что папки существуют
fs.mkdirSync(paths.report, { recursive: true });
fs.mkdirSync(paths.publicReport, { recursive: true });

// Собираем .html отчёты из report/
const files = fs
  .readdirSync(paths.report)
  .filter(f => f.endsWith(".html") && f !== "index.html")
  .sort((a, b) => {
    const aTime = fs.statSync(path.join(paths.report, a)).mtimeMs;
    const bTime = fs.statSync(path.join(paths.report, b)).mtimeMs;
    return bTime - aTime;
  });

const rows = files
  .map(file => {
    const time = fs.statSync(path.join(paths.report, file)).mtime.toLocaleString("uk-UA");
    return `<tr><td>${time}</td><td><a href="${file}" target="_blank">${file}</a></td></tr>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <title>Promelektroservice — Lighthouse Звіти</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; }
    table { border-collapse: collapse; width: 100%; background: white; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    a { color: #007acc; text-decoration: none; }
  </style>
</head>
<body>
  <h1>📊 Lighthouse Звіти</h1>
  <table>
    <thead>
      <tr><th>Час створення</th><th>Файл</th></tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="2">📭 Звітів не знайдено.</td></tr>`}
    </tbody>
  </table>
</body>
</html>`;

// Записываем в report/ и public/report/
fs.writeFileSync(path.join(paths.report, "index.html"), html, "utf-8");
fs.writeFileSync(path.join(paths.publicReport, "index.html"), html, "utf-8");

console.log("✅ Очищено старі звіти");
console.log("✅ Створено index.html з оновленими посиланнями");
