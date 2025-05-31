import React from "react";
import SeoHelmet from "../components/SeoHelmet";
import project1 from "../img/project1.webp";
// импорт остальных проектов...

const projects = [
  { src: project1, alt: "Проєкт 1" },
  // ...
];

const PortfolioPage = () => {
  return (
    <main className="page-with-footer">
      <SeoHelmet
        title="Портфоліо | ПромЕлектроСервіс"
        description="Ознайомтесь із нашими електромонтажними проектами"
        image="/img/portfolio-cover.webp"
        url="https://promelektroservice.vercel.app/portfolio"
      />
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
              width="300"
              height="200"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;
