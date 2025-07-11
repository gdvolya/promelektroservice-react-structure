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

// Удалить все отчёты кроме последнего из папки report/
function cleanupDir(dirPath) {
  if (!fs.existsSync(dirPath)) return null;

  const htmlFiles = fs.readdirSync(dirPath)
    .filter(f => f.endsWith(".html") && f !== "index.html")
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(dirPath, f)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time);

  const keep = htmlFiles[0]?.name || null;

  fs.readdirSync(dirPath).forEach(file => {
    if (isReportFile(file) && file !== "index.html" && file !== keep) {
      fs.unlinkSync(path.join(dirPath, file));
    }
  });

  return keep;
}

// Удаляем лишние отчёты в других папках
for (const key of ["lighthouseci", "lighthouseciReport", "publicReport"]) {
  if (fs.existsSync(paths[key])) {
    fs.readdirSync(paths[key]).forEach(file => {
      if (isReportFile(file)) {
        fs.unlinkSync(path.join(paths[key], file));
      }
    });
  }
}

// Очищаем report/ и получаем имя последнего отчёта
const lastReport = cleanupDir(paths.report);

// Генерируем HTML строку для таблицы
const rows = lastReport
  ? `<tr><td>${new Date().toLocaleString("uk-UA")}</td><td><a href="${lastReport}" target="_blank">${lastReport}</a></td></tr>`
  : `<tr><td colspan="2">📭 Звітів не знайдено.</td></tr>`;

// Генерируем HTML-страницу
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

// Создаём директории при необходимости
fs.mkdirSync(paths.publicReport, { recursive: true });

// Сохраняем index.html
fs.writeFileSync(path.join(paths.report, "index.html"), html, "utf-8");
fs.writeFileSync(path.join(paths.publicReport, "index.html"), html, "utf-8");

// Копируем последний отчёт в public/report
if (lastReport) {
  const from = path.join(paths.report, lastReport);
  const to = path.join(paths.publicReport, lastReport);
  fs.copyFileSync(from, to);
  console.log(`✅ Скопійовано у public/report/${lastReport}`);
}

console.log("✅ Очистка завершена, збережено останній звіт.");
