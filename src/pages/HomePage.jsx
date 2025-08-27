import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import '../styles/HomePage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const languages = ["uk", "en", "ru"];

export default function HomePage() {
  const { t } = useTranslation();
  const location = useLocation();

  const currentLang = languages.includes(location.pathname.split("/")[1])
    ? location.pathname.split("/")[1]
    : "uk";

  // Используем useEffect для инициализации AOS.
  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
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
        <div className="page-overlay"></div>
        
        <section className="hero" role="banner" aria-label={t('home.bannerAlt')}>
          <div className="hero-content">
            <h1 className="fancy-title" data-aos="fade-up">
              {t("home.heroTitle")}
            </h1>
            <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
              {t("home.heroSubtitle")}
            </p>
            <div className="hero-actions" data-aos="fade-up" data-aos-delay="200">
              <Link to={`/${currentLang}/contacts`} className="cta-btn primary-btn">
                {t("home.ctaBtn")}
              </Link>
              <Link to={`/${currentLang}/reviews`} className="cta-btn secondary-btn">
                {t("home.reviewsBtn")}
              </Link>
            </div>
          </div>
        </section>

        <section className="features" data-aos="fade-up">
          <h2 className="section-title">
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
                src="/icons/price.svg"
                className="feature-icon"
                alt={t('home.price')}
                loading="lazy"
                width="64"
                height="64"
              />
              <h3>{t('home.price')}</h3>
              <p>{t('home.priceDescription')}</p>
            </div>
          </div>
        </section>

        <section className="about-us" data-aos="fade-up">
          <div className="about-content">
            <h2 className="section-title">{t('home.aboutTitle')}</h2>
            <p>{t('home.aboutDescription')}</p>
            <Link to={`/${currentLang}/portfolio`} className="cta-btn secondary-btn">
              {t('home.aboutLink')}
            </Link>
          </div>
          <div className="about-image" data-aos="zoom-in">
            <img src="/img/team.webp" alt={t('home.aboutAlt')} loading="lazy" width="600" height="400" />
          </div>
        </section>
      </main>
    </>
  );
}