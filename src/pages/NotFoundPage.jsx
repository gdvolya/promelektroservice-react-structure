import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/NotFoundPage.css";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className="not-found-page">
      <Helmet>
        <title>{t("projectNotFound.title")}</title>
        <meta name="description" content={t("projectNotFound.description")} />
      </Helmet>

      <div className="notfound-content">
        <h1>404</h1>
        <h2>{t("projectNotFound.heading")}</h2>
        <p>{t("projectNotFound.message")}</p>
        <Link to={t("projectNotFound.backLink")} className="not-found-link">
          {t("projectNotFound.backButton")}
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;