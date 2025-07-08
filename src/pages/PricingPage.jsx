import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/PricingPage.css";

const tiers = [
  {
    title: "Базовий",
    price: "₴1 000+",
    features: ["Монтаж розеток", "Підключення освітлення"],
  },
  {
    title: "Стандарт",
    price: "₴3 000+",
    features: ["Монтаж щита", "Прокладка кабелю"],
  },
  {
    title: "Преміум",
    price: "₴6 000+",
    features: ["Проєктування електромереж", "Підключення генераторів"],
  },
];

const PricingPage = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  return (
    <main className="pricing-page">
      <Helmet>
        <title>Послуги та ціни — Promelektroservice</title>
        <meta
          name="description"
          content="Прайс на електромонтажні послуги для дому та бізнесу."
        />
      </Helmet>

      <h1 data-aos="fade-up">Послуги та ціни</h1>
      <div className="pricing-grid">
        {tiers.map(({ title, price, features }, index) => (
          <div
            key={title}
            className="pricing-card"
            data-aos="zoom-in"
            data-aos-delay={index * 150}
          >
            <h2>{title}</h2>
            <p className="price">{price}</p>
            <ul>
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PricingPage;
