import React from "react";
import SeoHelmet from "../components/SeoHelmet";

import project1 from "../img/project1.webp";
import project2 from "../img/project2.webp";
import project3 from "../img/project3.webp";
import project4 from "../img/project4.webp";
import project5 from "../img/project5.webp";
import project6 from "../img/project6.webp";
import project7 from "../img/project7.webp";

const projects = [
  { src: project1, alt: "Проєкт 1" },
  { src: project2, alt: "Проєкт 2" },
  { src: project3, alt: "Проєкт 3" },
  { src: project4, alt: "Проєкт 4" },
  { src: project5, alt: "Проєкт 5" },
  { src: project6, alt: "Проєкт 6" },
  { src: project7, alt: "Проєкт 7" },
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
