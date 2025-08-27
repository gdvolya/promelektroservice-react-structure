import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import '../styles/HomePage.css';

const languages = ["uk", "en", "ru"];

export default function HomePage() {
  const { t } = useTranslation();
  const location = useLocation();

  const currentLang = languages.includes(location.pathname.split("/")[1])
    ? location.pathname.split("/")[1]
    : "uk";

  // Подстраиваем тему страницы под body
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("dark-mode")) {
        document.querySelector(".home-page")?.classList.add("dark-mode");
      } else {
        document.querySelector(".home-page")?.classList.remove("dark-mode");
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('meta.homeTitle')}</title>
        <meta name="description" content={t('meta.homeDescription')} />
        <link
          rel="preload"
          as="image"
          href="/assets/background@2x.webp"
          type="image/webp"
          fetchpriority="high"
        />
      </Helmet>

      <main className="home-page">
        <div className="page-overlay"></div> {/* 🔹 Глобальное затемнение страницы */}
        
        <section className="hero" role="banner" aria-label={t('home.bannerAlt')}>
          <img
            src="/assets/background@2x.webp"
            alt=""
            aria-hidden="true"
            className="hero-background-img"
            width="1920"
            height="1080"
            loading="eager"
          />
          <div className="hero-overlay"></div>
          <div className="hero-content" data-aos="fade-up">
            <h1 className="hero-title">ПромЕлектроСервіс</h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>

            <div className="hero-descriptions">
              <p>{t('home.workDesc1')}</p>
              <p>{t('home.workDesc2')}</p>
              <p>{t('home.workDesc3')}</p>
            </div>

            <div className="hero-buttons">
              <Link to={`/${currentLang}/portfolio`} className="btn primary">
                {t('home.projectsBtn')}
              </Link>
              <Link to={`/${currentLang}/contacts`} className="btn secondary">
                {t('home.contactBtn')}
              </Link>
            </div>
          </div>
        </section>

        <section className="features" data-aos="fade-up" aria-labelledby="features-title">
          <h2 id="features-title" className="features-title">
            {t('home.whyChooseUs')}
          </h2>
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <img
                src="/icons/speed.svg"
                className="feature-icon"
                alt={t('home.speed')}
                loading="lazy"
                width="64"
                height="64"
              />
              <h3>{t('home.speed')}</h3>
              <p>{t('home.speedDesc')}</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <img
                src="/icons/quality.svg"
                className="feature-icon"
                alt={t('home.quality')}
                loading="lazy"
                width="64"
                height="64"
              />
              <h3>{t('home.quality')}</h3>
              <p>{t('home.qualityDesc')}</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <img
                src="/icons/secure.svg"
                className="feature-icon"
                alt={t('home.safety')}
                loading="lazy"
                width="64"
                height="64"
              />
              <h3>{t('home.safety')}</h3>
              <p>{t('home.safetyDesc')}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}