import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PortfolioPage.css";

// Важно: Этот массив должен соответствовать данным в файле translation.json
const projects = [
  {
    image: "/img/portfolio/project1.webp",
    key: "portfolio.projects.0",
  },
  {
    image: "/img/portfolio/project2.webp",
    key: "portfolio.projects.1",
  },
  {
    image: "/img/portfolio/smart_home.webp",
    key: "portfolio.projects.2",
  },
  {
    image: "/img/portfolio/industrial_installation.webp",
    key: "portfolio.projects.3",
  },
  {
    image: "/img/portfolio/project5.webp",
    key: "portfolio.projects.4",
  },
  {
    image: "/img/portfolio/project6.webp",
    key: "portfolio.projects.5",
  },
  {
    image: "/img/portfolio/project7.webp",
    key: "portfolio.projects.6",
  },
  {
    image: "/img/portfolio/project10.webp",
    key: "portfolio.projects.7",
  },
  {
    image: "/img/portfolio/project12.webp",
    key: "portfolio.projects.8",
  },
  {
    image: "/img/portfolio/project13.webp",
    key: "portfolio.projects.9",
  },
  {
    image: "/img/portfolio/project14.webp",
    key: "portfolio.projects.10",
  },
];

const PortfolioPage = () => {
  const { t } = useTranslation();

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
            aria-label={`${t(`${project.key}.title`)} — ${t(
              `${project.key}.description`
            )}`}
          >
            <img
              src={project.image}
              alt={t(`${project.key}.title`)}
              loading="lazy"
              decoding="async"
              className="portfolio-img"
              width="100%"
              height="auto"
            />
            <div className="card-content">
              <h2>{t(`${project.key}.title`)}</h2>
              <p>{t(`${project.key}.description`)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default PortfolioPage;