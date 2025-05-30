import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "../css/HomePage.css";

// Добавим компонент для переключения языка
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="language-switcher">
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      <button onClick={() => i18n.changeLanguage("uk")}>UK</button>
      <button onClick={() => i18n.changeLanguage("ru")}>RU</button>
    </div>
  );
}

function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="hero-section" itemScope itemType="https://schema.org/LocalBusiness">
      <Helmet>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <meta property="og:title" content={t("meta.ogTitle")} />
        <meta property="og:description" content={t("meta.ogDescription")} />
        <meta property="og:image" content="/img/background.webp" />
        <meta property="og:url" content="https://promelektroservice.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" as="image" href="/img/background.webp" />
      </Helmet>

      {/* Оптимизация загрузки фонового изображения */}
      <img src="/img/background.webp" alt="Background" className="lcp-bg" fetchpriority="high" loading="eager" />

      {/* Компонент для переключения языков */}
      <LanguageSwitcher />

      <div className="hero-content">
        <h1 className="hero-title fancy-title" itemProp="name">
          {t("companyName")}
        </h1>
        <h2 className="hero-subtitle" itemProp="description">
          {t("companyDescription")}
        </h2>
        <div className="description">
          {Array.from({ length: 7 }, (_, i) => (
            <p key={i}>{t(`services.${i}`)}</p>
          ))}
        </div>
      </div>
    </main>
  );
}

export default HomePage;
