const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

const sitemapUrls = [
  { url: "/", changefreq: "weekly", priority: 1.0 },
  { url: "/about", changefreq: "monthly", priority: 0.8 },
  { url: "/services", changefreq: "monthly", priority: 0.8 },
  { url: "/contacts", changefreq: "monthly", priority: 0.7 },
  // добавь другие страницы по необходимости
];

const sitemapPath = "./public/sitemap.xml.gz";
const hostname = "https://promelektroservice.vercel.app";

(async () => {
  const stream = new SitemapStream({ hostname });
  const pipeline = stream.pipe(createGzip());

  sitemapUrls.forEach((entry) => stream.write(entry));
  stream.end();

  const data = await streamToPromise(pipeline);
  fs.writeFileSync(sitemapPath, data);
  console.log("✅ Sitemap создан:", sitemapPath);
})();
