import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/PricingPage.css";

const PricingPage = () => {
  return (
    <main className="pricing-page">
      <Helmet>
        <title>Послуги та ціни — Promelektroservice</title>
        <meta
          name="description"
          content="Прайс на електромонтажні послуги для дому та бізнесу."
        />
      </Helmet>
      <h1>Послуги та ціни</h1>
      <div className="pricing-grid">
        <div className="pricing-card">
          <h2>Базовий</h2>
          <p className="price">₴1 000+</p>
          <ul>
            <li>Монтаж розеток</li>
            <li>Підключення освітлення</li>
          </ul>
        </div>
        <div className="pricing-card">
          <h2>Стандарт</h2>
          <p className="price">₴3 000+</p>
          <ul>
            <li>Монтаж щита</li>
            <li>Прокладка кабелю</li>
          </ul>
        </div>
        <div className="pricing-card">
          <h2>Преміум</h2>
          <p className="price">₴6 000+</p>
          <ul>
            <li>Проєктування електромереж</li>
            <li>Підключення генераторів</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default PricingPage;
