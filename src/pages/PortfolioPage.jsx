import React from "react";

// ✅ Импорт оптимизированных .webp изображений
import project1Webp from "../img/project1.webp";
import project2Webp from "../img/project2.webp";
import project3Webp from "../img/project3.webp";
import project4Webp from "../img/project4.webp";
import project5Webp from "../img/project5.webp";
import project6Webp from "../img/project6.webp";
import project7Webp from "../img/project7.webp";

const projects = [
  { src: project1Webp, alt: "Проєкт 1", preload: true },
  { src: project2Webp, alt: "Проєкт 2" },
  { src: project3Webp, alt: "Проєкт 3" },
  { src: project4Webp, alt: "Проєкт 4" },
  { src: project5Webp, alt: "Проєкт 5" },
  { src: project6Webp, alt: "Проєкт 6" },
  { src: project7Webp, alt: "Проєкт 7" },
];

const PortfolioPage = () => {
  return (
    <main className="page-with-footer">
      {/* 🔽 Предзагрузка ключевого изображения (для LCP) */}
      <link rel="preload" as="image" href={project1Webp} type="image/webp" />

      <section id="portfolio">
        <h1>Портфоліо</h1>
        <h2>Наші роботи</h2>
        <div className="portfolio-gallery">
          {projects.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={img.alt}
              className="portfolio-img"
              width="400"
              height="300"
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchpriority={idx === 0 ? "high" : undefined}
              style={{
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;
