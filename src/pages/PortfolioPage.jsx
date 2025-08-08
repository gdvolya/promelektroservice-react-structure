import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PortfolioPage.css";

const projects = [
  {
    thumb: "/img/portfolio/project14.webp",
    full: "/img/projects/project14.webp",
    key: "project1",
  },
  {
    thumb: "/img/portfolio/project10.webp",
    full: "/img/projects/project10.webp",
    key: "project2",
  },
  {
    thumb: "/img/portfolio/project12.webp",
    full: "/img/projects/project12.webp",
    key: "project3",
  },
  {
    thumb: "/img/portfolio/project7.webp",
    full: "/img/projects/project7.webp",
    key: "project4",
  },
  {
    thumb: "/img/portfolio/project13.webp",
    full: "/img/projects/project13.webp",
    key: "project5",
  },
  {
    thumb: "/img/portfolio/project2.webp",
    full: "/img/projects/project2.webp",
    key: "project6",
  },
  {
    thumb: "/img/portfolio/project1.webp",
    full: "/img/projects/project1.webp",
    key: "project7",
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
          <a
            href={project.full}
            key={index}
            className="portfolio-card"
            data-aos="fade-up"
            data-aos-delay={index * 100}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t(`portfolio.${project.key}.title`)} — ${t(`portfolio.${project.key}.description`)}`}
          >
            <img
              src={project.thumb}
              alt={t(`portfolio.${project.key}.title`)}
              loading="lazy"
              decoding="async"
              className="portfolio-img"
              width="100%"
              height="auto"
            />
            <div className="card-content">
              <h2>{t(`portfolio.${project.key}.title`)}</h2>
              <p>{t(`portfolio.${project.key}.description`)}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
};

export default PortfolioPage;
