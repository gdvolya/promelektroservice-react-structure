import React from "react";

// ✅ Импорт оптимизированных .webp изображений
import project1 from "../img/project1.webp";
import project2 from "../img/project2.webp";
import project3 from "../img/project3.webp";
import project4 from "../img/project4.webp";
import project5 from "../img/project5.webp";
import project6 from "../img/project6.webp";
import project7 from "../img/project7.webp";

const PortfolioPage = () => {
  const images = [project1, project2, project3, project4, project5, project6, project7];

  return (
    <main className="page-with-footer">
      <section id="portfolio">
        <h1>Портфоліо</h1>
        <h2>Наші роботи</h2>
        <div className="portfolio-gallery">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Проєкт ${idx + 1}`}
              className="portfolio-img"
              loading="lazy"
              width="400"
              height="300"
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
