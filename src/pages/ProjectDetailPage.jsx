import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/ProjectDetailPage.css";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const projects = t("portfolio.projects", { returnObjects: true });
  const project = projects[id];

  useEffect(() => {
    AOS.init({ once: true, duration: 700 });
  }, []);

  if (!project) {
    return (
      <main className="project-detail-page not-found">
        <Helmet>
          <title>{t("projectNotFound.title")}</title>
          <meta name="description" content={t("projectNotFound.description")} />
        </Helmet>
        <div data-aos="fade-up">
          <h1>{t("projectNotFound.heading")}</h1>
          <p>{t("projectNotFound.message")}</p>
          <button
            className="back-btn"
            onClick={() => navigate(t("projectNotFound.backLink"))}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("projectNotFound.backButton")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <Helmet>
        <title>{t("meta.projectTitle", { projectName: project.title })}</title>
        <meta
          name="description"
          content={t("meta.projectDescription", {
            projectName: project.title,
          })}
        />
      </Helmet>

      <button
        className="back-btn"
        onClick={() => navigate(t("project.backLink"))}
        data-aos="fade-up"
        data-aos-delay="300"
      >
        {t("project.backButton")}
      </button>
      
      <div className="project-details">
        <h1 data-aos="fade-up">{project.title}</h1>
        <img
          src={project.image}
          alt={project.title}
          className="project-image"
          data-aos="fade-up"
          loading="lazy"
          decoding="async"
        />
        <section className="project-info" data-aos="fade-up" data-aos-delay="200">
          <h2>{t("project.descriptionTitle")}</h2>
          <p>{project.description}</p>
          <ul className="project-details-list">
            <li>
              <strong>{t("project.type")}:</strong> {project.type}
            </li>
            <li>
              <strong>{t("project.duration")}:</strong> {project.duration}
            </li>
            <li>
              <strong>{t("project.address")}:</strong> {project.address}
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default ProjectDetailPage;