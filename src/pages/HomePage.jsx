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
    <div className="home-page">
      <Helmet>
        <title>{t('seo.homeTitle')}</title>
        <meta name="description" content={t('seo.homeDescription')} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      {/* ✅ Обновлено: Обернуто в .site-content-wrapper для отступа от шапки 
      */}
      <div className="site-content-wrapper">
        <main>
          {/* ✅ Обновлено: Удалены отступы, так как теперь фон начинается от самого верха 
          */}
          <section className="hero">
            <img
              src="/img/hero.webp"
              className="hero-background-img"
              alt="Background"
              loading="lazy"
              width="1920"
              height="1080"
            />
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">{t('home.heroTitle')}</h1>
              <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
              <div className="hero-descriptions">
                <p>{t('home.heroDescription1')}</p>
                <p>{t('home.heroDescription2')}</p>
                <p>{t('home.heroDescription3')}</p>
              </div>
              <div className="hero-buttons">
                <Link to="/contacts" className="btn primary">
                  {t('home.contactUs')}
                </Link>
                <Link to="/portfolio" className="btn secondary">
                  {t('home.viewPortfolio')}
                </Link>
              </div>
            </div>
          </section>

          <section className="features">
            <h2 className="features-title">
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
                <p>{t('home.speedDescription')}</p>
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
                <p>{t('home.qualityDescription')}</p>
              </div>
              <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
                <img
                  src="/icons/support.svg"
                  className="feature-icon"
                  alt={t('home.support')}
                  loading="lazy"
                  width="64"
                  height="64"
                />
                <h3>{t('home.support')}</h3>
                <p>{t('home.supportDescription')}</p>
              </div>
              <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
                <img
                  src="/icons/trust.svg"
                  className="feature-icon"
                  alt={t('home.trust')}
                  loading="lazy"
                  width="64"
                  height="64"
                />
                <h3>{t('home.trust')}</h3>
                <p>{t('home.trustDescription')}</p>
              </div>
            </div>
          </section>

          <section className="our-works">
            <h2 className="our-works-title">{t('home.ourWorks')}</h2>
            <p className="our-works-subtitle">
              {t('home.ourWorksDescription')}
            </p>
            <div className="our-works-grid">
              <div className="work-card">
                <h3>{t('home.work1Title')}</h3>
                <p>{t('home.work1Description')}</p>
              </div>
              <div className="work-card">
                <h3>{t('home.work2Title')}</h3>
                <p>{t('home.work2Description')}</p>
              </div>
              <div className="work-card">
                <h3>{t('home.work3Title')}</h3>
                <p>{t('home.work3Description')}</p>
              </div>
            </div>
            <Link to="/portfolio" className="btn primary our-works-btn">
              {t('home.viewMore')}
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}