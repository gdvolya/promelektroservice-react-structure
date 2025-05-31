import React from "react";
import { useTranslation } from "react-i18next";
import SeoHelmet from "../components/SeoHelmet";
import "../css/HomePage.css";

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

  const seoData = {
    title: t("meta.title"),
    description: t("meta.description"),
    image: "/img/background.webp",
    url: "https://promelektroservice.vercel.app",
  };

  return (
    <main className="hero-section" itemScope itemType="https://schema.org/LocalBusiness">
      <SeoHelmet {...seoData} />

      <img
        src={seoData.image}
        alt="Фон головної сторінки"
        className="lcp-bg"
        fetchpriority="high"
        loading="eager"
        width="1920"
        height="1080"
      />

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
