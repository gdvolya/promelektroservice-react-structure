import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PricingPage.css";

const services = [
  {
    categoryKey: "industrialInstallation",
    items: [
      "wiringIndustrial",
      "cableTrays",
      "powerPanels",
      "lightingIndustrial",
      "grounding",
      "motorInstallation",
    ],
  },
  {
    categoryKey: "maintenanceRepair",
    items: [
      "troubleshooting",
      "equipmentRepair",
      "preventiveMaintenance",
      "electricalTests",
    ],
  },
  {
    categoryKey: "automationControl",
    items: [
      "plcSystems",
      "scadaSystems",
      "variableFrequencyDrives",
      "sensorIntegration",
    ],
  },
  {
    categoryKey: "designDocumentation",
    items: [
      "projectDevelopment",
      "executiveDocumentation",
      "technicalConsultation",
    ],
  },
];

const PricingPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  return (
    <main className="pricing-page">
      <Helmet>
        <title>{t("meta.pricingTitle")}</title>
        <meta name="description" content={t("meta.pricingDescription")} />
      </Helmet>

      <h1 data-aos="fade-up">{t("pricing.title")}</h1>

      <div className="pricing-sections">
        {services.map((section, sectionIndex) => (
          <section key={sectionIndex} className="pricing-section" data-aos="fade-up" data-aos-delay={100 * (sectionIndex + 1)}>
            <h2 className="pricing-category-title">{t(`pricing.${section.categoryKey}.title`)}</h2>
            <ul className="pricing-list">
              {section.items.map((itemKey, itemIndex) => (
                <li key={itemIndex} className="pricing-item">
                  <span className="service-title">{t(`pricing.${itemKey}.title`)}</span>
                  <span className="service-price">{t(`pricing.${itemKey}.price`)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
};

export default PricingPage;