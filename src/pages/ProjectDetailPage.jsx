import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "../styles/ProjectDetailPage.css";

const projects = [
  { key: "portfolio.projects.0", image: "/img/portfolio/project1.webp" },
  { key: "portfolio.projects.1", image: "/img/portfolio/project2.webp" },
  { key: "portfolio.projects.2", image: "/img/portfolio/smart_home.webp" },
  { key: "portfolio.projects.3", image: "/img/portfolio/industrial_installation.webp" },
  { key: "portfolio.projects.4", image: "/img/portfolio/project5.webp" },
  { key: "portfolio.projects.5", image: "/img/portfolio/project6.webp" },
  { key: "portfolio.projects.6", image: "/img/portfolio/project7.webp" },
  { key: "portfolio.projects.7", image: "/img/portfolio/project10.webp" },
  { key: "portfolio.projects.8", image: "/img/portfolio/project12.webp" },
  { key: "portfolio.projects.9", image: "/img/portfolio/project13.webp" },
  { key: "portfolio.projects.10", image: "/img/portfolio/project14.webp" },
];

const ProjectDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const project = projects[id];

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  return (
    <main className="project-page">
      <Helmet>
        <title>{t(`${project.key}.title`)}</title>
        <meta name="description" content={t(`${project.key}.description`)} />
      </Helmet>

      <div className="project-details-container">
        <Link to="/portfolio" className="back-button">
          {t("project.backButton")}
        </Link>
        <h1 data-aos="fade-up">{t(`${project.key}.title`)}</h1>
        <img
          src={project.image}
          alt={t(`${project.key}.title`)}
          className="project-image"
        />
        <div className="info-box">
          <p className="project-description">{t(`${project.key}.description`)}</p>
          <div className="info-item">
            <span>{t("project.type")}:</span> {t(`${project.key}.type`)}
          </div>
          <div className="info-item">
            <span>{t("project.duration")}:</span> {t(`${project.key}.duration`)}
          </div>
          <div className="info-item">
            <span>{t("project.address")}:</span> {t(`${project.key}.address`)}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetailPage;