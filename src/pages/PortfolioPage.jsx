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
    title: "Монтаж електропроводки в офісі",
    description: "Комплексний монтаж електропроводки з урахуванням офісної специфіки та безпеки.",
  },
  {
    image: "/img/portfolio/project10.webp",
    title: "Освітлення торгового центру",
    description: "Проєктування та встановлення сучасного освітлення у великому ТЦ.",
  },
  {
    image: "/img/portfolio/project12.webp",
    title: "Умний дім",
    description: "Інтеграція систем розумного дому з автоматизацією електромереж.",
  },
  {
    image: "/img/portfolio/project7.webp",
    title: "Промисловий монтаж",
    description: "Промислове електромонтажне рішення для виробничого комплексу.",
  },
  {
    image: "/img/portfolio/project13.webp",
    title: "Монтаж фасадного освітлення",
    description: "Естетичне та функціональне освітлення фасаду бізнес-центру.",
  },
  {
    image: "/img/portfolio/project2.webp",
    title: "Щитові шафи",
    description: "Збірка, монтаж і підключення розподільчих щитів для комерційного об’єкта.",
  },
  {
    image: "/img/portfolio/project1.webp",
    title: "Сонячні панелі",
    description: "Установка та підключення сонячних панелей для автономного енергоживлення.",
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
