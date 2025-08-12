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
        <style>{`
          body, main {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .hero-content {
            position: absolute;
            top: 75px; /* Учитываем высоту шапки */
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            text-align: center;
            z-index: 2;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0;
          }
          .hero-title {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-size: 4rem;
            margin: 0 0 0.5rem 0 !important;
            color: #fff;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            text-align: center;
            width: 100%;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }
          .hero-subtitle {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.6rem;
            font-weight: 500;
            color: #f0f0f0;
            margin: 0 0 0.8rem 0 !important;
            text-align: center;
            max-width: 800px;
            width: 100%;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
          }
          .hero-buttons {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            flex-wrap: nowrap;
            width: 100%;
            margin: 0 !important;
          }
          .hero-buttons .btn {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
          }
          @media (max-width: 992px) {
            .hero-content {
              top: 60px; /* Учитываем уменьшенную высоту шапки */
            }
            .hero-title {
              font-size: 3rem;
              letter-spacing: 1px;
              margin: 0 0 0.3rem 0 !important;
            }
            .hero-subtitle {
              font-size: 1.15rem;
              margin: 0 0 0.5rem 0 !important;
            }
            .hero-buttons {
              gap: 0.5rem;
            }
            .hero-buttons .btn {
              padding: 0.5rem 1rem;
              font-size: 0.9rem;
            }
          }
          @media (max-width: 600px) {
            .hero-content {
              top: 60px;
            }
            .hero-title {
              font-size: 2.4rem;
              margin: 0 0 0.3rem 0 !important;
            }
            .hero-subtitle {
              font-size: 1rem;
              margin: 0 0 0.5rem 0 !important;
            }
          }
        `}</style>
      </Helmet>

      <main className="home-page">
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
      </main>
    </>
  );
}