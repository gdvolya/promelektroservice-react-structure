const fs = require("fs");
const path = require("path");

const paths = {
  lighthouseci: path.join(__dirname, "..", ".lighthouseci"),
  lighthouseciReport: path.join(__dirname, "..", ".lighthouseci", "report"),
  report: path.join(__dirname, "..", "report"),
  publicReport: path.join(__dirname, "..", "public", "report"),
};

const isReportFile = file =>
  file.endsWith(".html") || file.endsWith(".json");

// Удалить все отчёты кроме самого последнего .html из /report
function cleanupDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const htmlFiles = fs.readdirSync(dirPath)
    .filter(f => f.endsWith(".html") && f !== "index.html")
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(dirPath, f)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time);

  const keep = htmlFiles.length > 0 ? htmlFiles[0].name : null;

  fs.readdirSync(dirPath).forEach(file => {
    if (isReportFile(file) && file !== "index.html" && file !== keep) {
      fs.unlinkSync(path.join(dirPath, file));
    }
  });

  return keep; // Возвращаем имя последнего отчёта
}

// Удалить лишние отчёты и получить последний отчёт
const lastReport = cleanupDir(paths.report);

// Очистить остальные директории
for (const key of ["lighthouseci", "lighthouseciReport", "publicReport"]) {
  if (fs.existsSync(paths[key])) {
    fs.readdirSync(paths[key]).forEach(file => {
      if (isReportFile(file)) {
        fs.unlinkSync(path.join(paths[key], file));
      }
    });
  }
}

const rows = lastReport
  ? `<tr><td>${new Date().toLocaleString("uk-UA")}</td><td><a href="${lastReport}" target="_blank">${lastReport}</a></td></tr>`
  : `<tr><td colspan="2">📭 Звітів не знайдено.</td></tr>`;

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
    <thead><tr><th>Час створення</th><th>Файл</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

fs.writeFileSync(path.join(paths.report, "index.html"), html, "utf-8");
fs.mkdirSync(paths.publicReport, { recursive: true });
fs.writeFileSync(path.join(paths.publicReport, "index.html"), html, "utf-8");

console.log("✅ Очистка завершена, збережено останній звіт.");
