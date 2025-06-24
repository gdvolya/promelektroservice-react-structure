import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import projects from "../data/projects";
import "../styles/ProjectDetailPage.css";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Знайти проект по індексу або унікальному ідентифікатору
  const project = projects[parseInt(projectId, 10)];

  if (!project) {
    return (
      <main className="project-detail-page">
        <h1>Проект не знайдено</h1>
        <button className="back-btn" onClick={() => navigate("/portfolio")}>Повернутися до портфоліо</button>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <Helmet>
        <title>{project.title} — Promelektroservice</title>
        <meta
          name="description"
          content={`Детальна інформація про проект ${project.title}.`}
        />
      </Helmet>

      <h1>{project.title}</h1>
      <img src={project.image} alt={project.title} className="project-detail-img" />

      <section className="project-info">
        <h2>Опис проекту</h2>
        <p>{project.description}</p>
        {/* Можеш розширювати список характеристик */}
        <ul>
          <li><strong>Тип робіт:</strong> Електромонтаж</li>
          <li><strong>Термін виконання:</strong> 2 тижні</li>
          <li><strong>Адреса:</strong> Київ, вул. Прикладна, 1</li>
        </ul>
      </section>

      <button className="back-btn" onClick={() => navigate("/portfolio")}>← До портфоліо</button>
    </main>
  );
};

export default ProjectDetailPage;
