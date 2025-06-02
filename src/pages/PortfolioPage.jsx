import React from "react";
import SeoHelmet from "../components/SeoHelmet";

const projects = [
  { src: "/img/project1.webp", alt: "Проєкт 1" },
  { src: "/img/project2.webp", alt: "Проєкт 2" },
  { src: "/img/project3.webp", alt: "Проєкт 3" },
  { src: "/img/project4.webp", alt: "Проєкт 4" },
  { src: "/img/project5.webp", alt: "Проєкт 5" },
  { src: "/img/project6.webp", alt: "Проєкт 6" },
  { src: "/img/project7.webp", alt: "Проєкт 7" },
];

const PortfolioPage = () => {
  return (
    <main className="page-with-footer">
      <SeoHelmet
        title="Портфоліо | ПромЕлектроСервіс"
        description="Ознайомтесь із нашими електромонтажними проектами"
        image="/img/portfolio-cover.webp"
        url="https://promelektroservice.vercel.app/portfolio"
        preloadImage={false}
      />
      <section id="portfolio">
        <h1>Портфоліо</h1>
        <h2>Наші роботи</h2>
        <div className="portfolio-gallery">
          {projects.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              srcSet={`${img.src} 1x, ${img.src.replace(".webp", "@2x.webp")} 2x`}
              sizes="(max-width: 768px) 100vw, 300px"
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
