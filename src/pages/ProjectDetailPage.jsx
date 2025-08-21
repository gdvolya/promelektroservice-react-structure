import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/ProjectDetailPage.css";
import { getProjectData } from "../utils/projectUtils";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Получаем данные о проекте, используя вспомогательную функцию
  const project = getProjectData(t, projectId);

  useEffect(() => {
    AOS.init({ once: true, duration: 700 });
  }, []);

  // Если проект не найден, показываем сообщение об ошибке
  if (!project) {
    return (
      <main className="project-detail-page not-found">
        <Helmet>
          <title>{t("projectNotFound.title")}</title>
          <meta name="description" content={t("projectNotFound.description")} />
        </Helmet>
        <h1 data-aos="fade-up">{t("projectNotFound.heading")}</h1>
        <p data-aos="fade-up" data-aos-delay="100">
          {t("projectNotFound.message")}
        </p>
        <button
          className="back-btn"
          onClick={() => navigate(t("projectNotFound.backLink"))}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {t("projectNotFound.backButton")}
        </button>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <Helmet>
        <title>{t("meta.projectTitle", { projectName: project.title })}</title>
        <meta name="description" content={t("meta.projectDescription", { projectName: project.title })} />
      </Helmet>
      
      <h1 data-aos="fade-up">{project.title}</h1>
      <img
        src={project.image}
        alt={project.title}
        className="project-detail-img"
        data-aos="fade-up"
        data-aos-delay="100"
        loading="lazy"
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

      <button
        className="back-btn"
        onClick={() => navigate(t("project.backLink"))}
        data-aos="fade-up"
        data-aos-delay="300"
      >
        {t("project.backButton")}
      </button>
    </main>
  );
};

export default ProjectDetailPage;