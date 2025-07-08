import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/HomePage.css";

export default function HomePage() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }, []);

  return (
    <main className="home-page">
      {/* 🔷 Hero Section with Background Overlay */}
      <section className="hero" role="banner" aria-label={t("home.bannerAlt")}>
        <div className="hero-overlay" />
        <div className="hero-content" data-aos="fade-up">
          <h1 className="hero-title">Promelektroservice</h1>
          <p className="hero-subtitle">{t("home.subtitle")}</p>
          <div className="hero-buttons">
            <Link to="/portfolio" className="btn primary">
              {t("home.projectsBtn")}
            </Link>
            <Link to="/contacts" className="btn secondary">
              {t("home.contactBtn")}
            </Link>
          </div>
        </div>
      </section>

      {/* 🔹 Advantages Section */}
      <section className="features" data-aos="fade-up">
        <h2 className="features-title">{t("home.whyChooseUs")}</h2>
        <div className="features-grid">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
            <img
              src="/icons/speed.svg"
              alt={t("home.speed")}
              className="feature-icon"
              width="64"
              height="64"
              loading="lazy"
            />
            <h3>{t("home.speed")}</h3>
            <p>{t("home.speedDesc")}</p>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <img
              src="/icons/quality.svg"
              alt={t("home.quality")}
              className="feature-icon"
              width="64"
              height="64"
              loading="lazy"
            />
            <h3>{t("home.quality")}</h3>
            <p>{t("home.qualityDesc")}</p>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <img
              src="/icons/secure.svg"
              alt={t("home.safety")}
              className="feature-icon"
              width="64"
              height="64"
              loading="lazy"
            />
            <h3>{t("home.safety")}</h3>
            <p>{t("home.safetyDesc")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
