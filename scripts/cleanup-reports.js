const fs = require("fs");
const path = require("path");

const lighthouseDir = path.join(__dirname, "..", ".lighthouseci");
const reportsDir = path.join(__dirname, "..", "report");
const publicDir = path.join(__dirname, "..", "public", "report");
const outputFile = path.join(reportsDir, "index.html");
const publicOutputFile = path.join(publicDir, "index.html");

function cleanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith(".html") || file.endsWith(".json")) {
      fs.unlinkSync(path.join(dir, file));
    }
  });
}

// Очистить старые отчёты
cleanDirectory(lighthouseDir);
cleanDirectory(reportsDir);
cleanDirectory(publicDir);

if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const files = fs
  .readdirSync(reportsDir)
  .filter(f => f.endsWith(".html") && f !== "index.html")
  .sort((a, b) => {
    const aTime = fs.statSync(path.join(reportsDir, a)).mtimeMs;
    const bTime = fs.statSync(path.join(reportsDir, b)).mtimeMs;
    return bTime - aTime;
  });

// Скопировать каждый отчёт в public/report
files.forEach(file => {
  const src = path.join(reportsDir, file);
  const dest = path.join(publicDir, file);
  fs.copyFileSync(src, dest);
});

const rows = files
  .map(file => {
    const time = fs.statSync(path.join(reportsDir, file)).mtime.toLocaleString("uk-UA");
    return `<tr><td>${time}</td><td><a href="${file}" target="_blank">${file}</a></td></tr>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
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
      ${rows}
    </tbody>
  </table>
</body>
</html>`;

fs.writeFileSync(outputFile, html, "utf-8");
fs.writeFileSync(publicOutputFile, html, "utf-8");

console.log(`✅ Очищено і створено: ${outputFile}`);
console.log(`✅ Скопійовано у public: ${publicOutputFile}`);
