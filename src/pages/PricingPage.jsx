import React from "react";
import { useTranslation } from "react-i18next";
import SeoHelmet from "../components/SeoHelmet";
import "../styles/PricingPage.css";

const PricingPage = () => {
  const { t } = useTranslation();

  return (
    <main className="pricing-page">
      <SeoHelmet
        title={t("pricing.meta.title")}
        description={t("pricing.meta.description")}
        url="https://promelektroservice.com/pricing"
      />

      <section className="pricing-section">
        <h1>{t("pricing.title")}</h1>
        <p>{t("pricing.subtitle")}</p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h2>{t("pricing.basic.title")}</h2>
            <p className="price">₴1 000+</p>
            <ul>
              <li>{t("pricing.basic.item1")}</li>
              <li>{t("pricing.basic.item2")}</li>
              <li>{t("pricing.basic.item3")}</li>
            </ul>
          </div>

          <div className="pricing-card">
            <h2>{t("pricing.standard.title")}</h2>
            <p className="price">₴3 000+</p>
            <ul>
              <li>{t("pricing.standard.item1")}</li>
              <li>{t("pricing.standard.item2")}</li>
              <li>{t("pricing.standard.item3")}</li>
            </ul>
          </div>

          <div className="pricing-card">
            <h2>{t("pricing.premium.title")}</h2>
            <p className="price">₴6 000+</p>
            <ul>
              <li>{t("pricing.premium.item1")}</li>
              <li>{t("pricing.premium.item2")}</li>
              <li>{t("pricing.premium.item3")}</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PricingPage;
