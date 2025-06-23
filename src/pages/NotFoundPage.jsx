import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SeoHelmet from "../components/SeoHelmet";
import "../styles/NotFoundPage.css";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className="not-found-page">
      <SeoHelmet
        title={t("notfound.meta.title")}
        description={t("notfound.meta.description")}
        url="https://promelektroservice.com/404"
      />

      <section className="notfound-section">
        <h1>404</h1>
        <h2>{t("notfound.title")}</h2>
        <p>{t("notfound.description")}</p>
        <Link to="/" className="back-home">
          {t("notfound.back")}
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
