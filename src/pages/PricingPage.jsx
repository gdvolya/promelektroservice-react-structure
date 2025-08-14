import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PricingPage.css";

const PricingPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  // Собираем 30 услуг из translation.json, ключи service1..service30
  const services = Array.from({ length: 30 }, (_, i) => {
    const key = `service${i + 1}`;
    return {
      title: t(`pricing.${key}.title`),
      price: t(`pricing.${key}.price`),
    };
  });

  return (
    <main className="pricing-page">
      <Helmet>
        <title>{t("meta.pricingTitle")}</title>
        <meta name="description" content={t("meta.pricingDescription")} />
      </Helmet>

      <h1 data-aos="fade-up">{t("pricing.title")}</h1>

      <ul className="pricing-list" data-aos="fade-up" data-aos-delay="200">
        {services.map(({ title, price }, index) => (
          <li key={index} className="pricing-item">
            <span className="service-title">{title}</span>
            <span className="service-price">{price}</span>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default PricingPage;
