import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next"; // Импортируем useTranslation
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PricingPage.css";

const tiers = [
  {
    key: "basic",
    title: "Базовий",
    price: "₴1 000+",
    features: [
      "Монтаж розеток",
      "Підключення освітлення",
      "Ознайомлення з проектом",
    ],
  },
  {
    key: "standard",
    title: "Стандарт",
    price: "₴3 000+",
    features: [
      "Монтаж щита",
      "Прокладка кабелю",
      "Підключення освітлення",
      "Оперативна консультація",
    ],
  },
  {
    key: "premium",
    title: "Преміум",
    price: "₴6 000+",
    features: [
      "Проєктування електромереж",
      "Підключення генераторів",
      "Автоматизація процесів",
      "Моніторинг та обслуговування",
    ],
  },
  {
    key: "enterprise", // Новый тариф
    title: "Підприємство",
    price: "₴15 000+",
    features: [
      "Енергозбереження",
      "Розробка великих інфраструктур",
      "Персоналізований супровід",
      "Гарантійне обслуговування",
    ],
  },
];

const PricingPage = () => {
  const { t } = useTranslation(); // Используем hook для перевода

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  return (
    <main className="pricing-page">
      <Helmet>
        <title>{t("meta.pricingTitle")}</title> {/* Переводим title */}
        <meta
          name="description"
          content={t("meta.pricingDescription")} // Переводим описание
        />
      </Helmet>

      <h1 data-aos="fade-up">{t("pricing.title")}</h1> {/* Переводим заголовок */}

      <div className="pricing-grid">
        {tiers.map(({ key, title, price, features }, index) => (
          <div
            key={key}
            className="pricing-card"
            data-aos="zoom-in"
            data-aos-delay={index * 150}
          >
            <h2>{t(`pricing.${key}.title`)}</h2> {/* Переводим тарифы */}
            <p className="price">{price}</p>
            <ul>
              {features.map((feature) => (
                <li key={feature}>{t(`pricing.${key}.${feature}`)}</li> // Переводим особенности
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PricingPage;
