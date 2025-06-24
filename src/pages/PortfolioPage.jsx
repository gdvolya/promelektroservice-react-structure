import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import projects from "../data/projects";
import "../styles/PortfolioPage.css";

const PortfolioPage = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <main className="portfolio-page">
      <Helmet>
        <title>Портфоліо - Promelektroservice</title>
        <meta
          name="description"
          content="Приклади наших робіт: електромонтаж, освітлення, щитове обладнання та інше."
        />
      </Helmet>

      <section className="portfolio-header" data-aos="fade-down">
        <h1>Наші проекти</h1>
        <p>Дізнайтесь більше про наші реалізовані роботи для клієнтів у Києві.</p>
      </section>

      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <div
            key={index}
            className="portfolio-card"
            data-aos="zoom-in"
            data-aos-delay={index * 100}
          >
            <img
              src={project.image}
              alt={`Проект: ${project.title}`}
              loading="lazy"
              className="portfolio-image"
            />
            <div className="card-content">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <button
                className="details-btn"
                onClick={() => alert(`Деталі проекту: ${project.title}`)}
              >
                Детальніше
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PortfolioPage;
