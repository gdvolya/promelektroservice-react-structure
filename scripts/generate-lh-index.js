const fs = require("fs");
const path = require("path");

const reportsDir = path.join(__dirname, "..", "report");
const publicDir = path.join(__dirname, "..", "public", "report");
const outputFile = path.join(reportsDir, "index.html");
const publicOutputFile = path.join(publicDir, "index.html");

if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const isValidHtmlReport = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  return content.includes("<html") && content.includes("<body") && content.includes("Lighthouse Report");
};

const files = fs
  .readdirSync(reportsDir)
  .filter(f => f.endsWith(".html") && f !== "index.html")
  .filter(f => isValidHtmlReport(path.join(reportsDir, f)))
  .sort((a, b) => {
    const aTime = fs.statSync(path.join(reportsDir, a)).mtimeMs;
    const bTime = fs.statSync(path.join(reportsDir, b)).mtimeMs;
    return bTime - aTime;
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
      ${rows || `<tr><td colspan="2">❌ Жодного коректного звіту не знайдено.</td></tr>`}
    </tbody>
  </table>
</body>
</html>`;

fs.writeFileSync(outputFile, html, "utf-8");
fs.writeFileSync(publicOutputFile, html, "utf-8");

console.log(`✅ Створено: ${outputFile}`);
console.log(`✅ Скопійовано у public: ${publicOutputFile}`);
