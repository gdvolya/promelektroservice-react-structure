import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "../styles/PricingPage.css";

const tiers = ["basic", "standard", "premium"];

const PricingPage = () => {
  const { t } = useTranslation();

  return (
    <main className="pricing-page">
      <Helmet>
        <title>{t("meta.pricingTitle")}</title>
        <meta name="description" content={t("meta.pricingDescription")} />
      </Helmet>

      <h1>{t("pricing.title")}</h1>

      <div className="pricing-grid">
        {tiers.map((tierKey) => {
          const title = t(`pricing.${tierKey}.title`);
          const price = t(`pricing.${tierKey}.price`);
          const features = t(`pricing.${tierKey}.features`, { returnObjects: true });

          return (
            <div key={tierKey} className="pricing-card" aria-label={`${title} — ${price}`}>
              <h2>{title}</h2>
              <p className="price">{price}</p>
              <ul>
                {features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default PricingPage;
