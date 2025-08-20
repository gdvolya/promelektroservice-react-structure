import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";
import "../styles/HomePage.css";

export default function HomePage() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }, []);

  return (
    <>
      <Helmet>
        <title>{t("meta.homeTitle")}</title>
        <meta name="description" content={t("meta.homeDescription")} />
        <link
          rel="preload"
          as="image"
          href="/assets/background@2x.webp"
          type="image/webp"
          fetchpriority="high"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;800;900&display=swap"
        />
      </Helmet>

      <main className="home-page">
        {/* Hero */}
        <section
          className="hero"
          role="banner"
          aria-label={t("home.bannerAlt")}
        >
          <img
            src="/assets/background@2x.webp"
            alt=""
            aria-hidden="true"
            className="hero-background-img"
            width={1920}
            height={1080}
            loading="eager"
          />
          <div className="hero-overlay"></div>
          <div className="hero-content" data-aos="fade-up">
            <h1 className="hero-title">ПромЕлектроСервіс</h1>
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

        {/* Features */}
        <section
          className="features"
          data-aos="fade-up"
          aria-labelledby="features-title"
        >
          <h2 id="features-title" className="features-title">
            {t("home.whyChooseUs")}
          </h2>
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <img
                src="/icons/speed.svg"
                className="feature-icon"
                alt={t("home.speed")}
                loading="lazy"
                width="64"
                height="64"
              />
              <h3>{t("home.speed")}</h3>
              <p>{t("home.speedDesc")}</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <img
                src="/icons/quality.svg"
                className="feature-icon"
                alt={t("home.quality")}
                loading="lazy"
                width="64"
                height="64"
              />
              <h3>{t("home.quality")}</h3>
              <p>{t("home.qualityDesc")}</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <img
                src="/icons/secure.svg"
                className="feature-icon"
                alt={t("home.safety")}
                loading="lazy"
                width="64"
                height="64"
              />
              <h3>{t("home.safety")}</h3>
              <p>{t("home.safetyDesc")}</p>
            </div>
          </div>
        </section>

        {/* Our Works */}
        <section
          className="our-works"
          data-aos="fade-up"
          aria-labelledby="our-works-title"
        >
          <h2 id="our-works-title" className="our-works-title">
            {t("home.ourWorksTitle")}
          </h2>
          <p className="our-works-subtitle">{t("home.ourWorksSubtitle")}</p>

          <div className="our-works-grid">
            <div className="work-card" data-aos="fade-up" data-aos-delay="100">
              <h3>{t("home.project1Title")}</h3>
              <p>{t("home.project1Desc")}</p>
            </div>
            <div className="work-card" data-aos="fade-up" data-aos-delay="200">
              <h3>{t("home.project2Title")}</h3>
              <p>{t("home.project2Desc")}</p>
            </div>
          </div>

          <div className="our-works-btn">
            <Link to="/portfolio" className="btn primary">
              {t("home.viewAllProjectsBtn")}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
