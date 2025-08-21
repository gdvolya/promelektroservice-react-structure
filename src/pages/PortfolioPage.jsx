import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PortfolioPage.css";

const PortfolioPage = () => {
  const { t } = useTranslation();

  // Получаем список проектов из файла переводов
  const projects = t("portfolio.projects", { returnObjects: true });

  useEffect(() => {
    AOS.init({ once: true, duration: 700 });
  }, []);

  return (
    <main className="portfolio-page">
      <Helmet>
        <title>{t("meta.portfolioTitle")}</title>
        <meta name="description" content={t("meta.portfolioDescription")} />
      </Helmet>

      <h1 data-aos="fade-up">{t("portfolio.heading")}</h1>

      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <Link
            to={`/portfolio/${index}`}
            key={index}
            className="portfolio-card"
            data-aos="fade-up"
            data-aos-delay={index * 100}
            aria-label={`${project.title} — ${project.description}`}
          >
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="portfolio-img"
              width="100%"
              height="auto"
            />
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