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
        {/* Шрифт Montserrat */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap"
        />
        <style>{`
          .hero-content {
            position: absolute;
            top: 5%; /* подняли выше */
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            z-index: 2;
            width: 100%;
            max-width: 1200px;
            padding: 0 1rem;
          }
          .hero-title {
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            font-size: 4rem;
            margin-bottom: 0.8rem;
            color: #fff;
            letter-spacing: 1px;
          }
          .hero-subtitle {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.6rem;
            font-weight: 400;
            color: #f0f0f0;
            margin-bottom: 1.5rem;
          }
          .hero-buttons .btn {
            margin: 0 0.5rem;
          }
          @media (max-width: 768px) {
            .hero-content {
              top: 3%;
            }
            .hero-title {
              font-size: 2.5rem;
            }
            .hero-subtitle {
              font-size: 1.2rem;
            }
          }
        `}</style>
      </Helmet>

      <main className="home-page">
        {/* 🔷 Hero Section */}
        <section
          className="hero"
          role="banner"
          aria-label={t("home.bannerAlt")}
          style={{ position: "relative", overflow: "hidden" }}
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

        {/* 🔹 Why Choose Us Section */}
        <section
          className="features"
          data-aos="fade-up"
          aria-labelledby="features-title"
        >
          <h2 id="features-title" className="features-title">
            {t("home.whyChooseUs")}
          </h2>
          <div className="features-grid">
            {/* 🔸 Speed */}
            <div
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay="100"
            >
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

            {/* 🔸 Quality */}
            <div
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay="200"
            >
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

            {/* 🔸 Safety */}
            <div
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay="300"
            >
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
      </main>
    </>
  );
}
