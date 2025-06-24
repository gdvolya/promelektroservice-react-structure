import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import projects from "../data/projects";
import "../styles/PortfolioPage.css";

AOS.init();

const PortfolioPage = () => {
  return (
    <main className="portfolio-page">
      <Helmet>
        <title>Портфоліо — Promelektroservice</title>
        <meta
          name="description"
          content="Приклади наших робіт: електромонтаж, освітлення, щитове обладнання та інше."
        />
      </Helmet>

      <h1 data-aos="fade-up">Наші проекти</h1>
      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <Link
            to={`/portfolio/${index}`}
            key={index}
            className="portfolio-card"
            data-aos="zoom-in"
            data-aos-delay={index * 100}
          >
            <img src={project.image} alt={project.title} loading="lazy" />
            <div className="card-content">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default PortfolioPage;
