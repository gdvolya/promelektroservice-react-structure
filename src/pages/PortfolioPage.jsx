import React from "react";
import project1 from "../img/project1.jpg";
import project2 from "../img/project2.jpg";
import project3 from "../img/project3.jpg";
import project4 from "../img/project4.jpg";
import project5 from "../img/project5.jpg";
import project6 from "../img/project6.jpg";
import project7 from "../img/project7.jpg";

const PortfolioPage = () => {
  return (
    <main className="page-with-footer">
      <section id="portfolio">
        <h1>Портфоліо</h1>
        <h2>Наші роботи</h2>
        <div className="portfolio-gallery">
          {[project1, project2, project3, project4, project5, project6, project7].map((src, idx) => (
            <img key={idx} src={src} alt={`Проєкт ${idx + 1}`} className="portfolio-img" />
          ))}
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;
