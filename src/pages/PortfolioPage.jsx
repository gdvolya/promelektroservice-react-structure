import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PortfolioPage.css";

const projects = [
  {
    image: "/img/portfolio/project14.webp",
    key: "project1",
  },
  {
    image: "/img/portfolio/project10.webp",
    key: "project2",
  },
  {
    image: "/img/portfolio/project12.webp",
    key: "project3",
  },
  {
    image: "/img/portfolio/project7.webp",
    key: "project4",
  },
  {
    image: "/img/portfolio/project13.webp",
    key: "project5",
  },
  {
    image: "/img/portfolio/project2.webp",
    key: "project6",
  },
  {
    image: "/img/portfolio/project1.webp",
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
          <Link
            to={`/portfolio/${project.key}`}
            key={project.key}
            className="portfolio-card"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <figure className="portfolio-figure">
              <img
                src={project.image}
                alt={t(`portfolio.${project.key}.title`)}
                loading="lazy"
                decoding="async"
                className="portfolio-img"
                width="100%"
                height="auto"
              />
              <figcaption className="card-content">
                <h2>{t(`portfolio.${project.key}.title`)}</h2>
                <p>{t(`portfolio.${project.key}.description`)}</p>
              </figcaption>
            </figure>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default PortfolioPage;