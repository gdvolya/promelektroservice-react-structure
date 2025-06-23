const fs = require("fs");
const zlib = require("zlib");
const { SitemapStream } = require("sitemap");

const sitemap = new SitemapStream({ hostname: "https://promelektroservice.com" });

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/portfolio", changefreq: "weekly", priority: 0.9 },
  { url: "/contacts", changefreq: "monthly", priority: 0.8 },
  { url: "/reviews", changefreq: "monthly", priority: 0.8 },
  { url: "/pricing", changefreq: "monthly", priority: 0.8 },
];

links.forEach(link => sitemap.write(link));
sitemap.end();

const output = fs.createWriteStream("./public/sitemap.xml.gz");
sitemap.pipe(zlib.createGzip()).pipe(output);

output.on("finish", () => {
  console.log("✅ Sitemap создан: ./public/sitemap.xml.gz");
});
