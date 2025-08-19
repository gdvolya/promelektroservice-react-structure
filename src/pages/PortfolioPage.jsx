import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PortfolioPage.css";

const projects = [
  {
    image: "/img/portfolio/project14",
    key: "project1",
    width: 1280,
    height: 720,
    priority: true, // 🚀 LCP элемент
  },
  {
    image: "/img/portfolio/project10",
    key: "project2",
    width: 1280,
    height: 720,
  },
  {
    image: "/img/portfolio/project12",
    key: "project3",
    width: 1280,
    height: 720,
  },
  {
    image: "/img/portfolio/project7",
    key: "project4",
    width: 1280,
    height: 720,
  },
  {
    image: "/img/portfolio/project13",
    key: "project5",
    width: 1280,
    height: 720,
  },
  {
    image: "/img/portfolio/project2",
    key: "project6",
    width: 1280,
    height: 720,
  },
  {
    image: "/img/portfolio/project1",
    key: "project7",
    width: 1280,
    height: 720,
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
            aria-label={`${t(`portfolio.${project.key}.title`)} — ${t(
              `portfolio.${project.key}.description`
            )}`}
          >
            <picture>
              <source srcSet={`${project.image}.avif`} type="image/avif" />
              <source srcSet={`${project.image}.webp`} type="image/webp" />
              <img
                src={`${project.image}.jpg`}
                alt={t(`portfolio.${project.key}.title`)}
                width={project.width}
                height={project.height}
                className="portfolio-img"
                loading={project.priority ? "eager" : "lazy"}
                fetchpriority={project.priority ? "high" : undefined}
                decoding="async"
              />
            </picture>
            <div className="card-content">
              <h2>{t(`portfolio.${project.key}.title`)}</h2>
              <p>{t(`portfolio.${project.key}.description`)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default PortfolioPage;
