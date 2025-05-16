import React from "react";

function PricingPage() {
  return (
    <main className="page-with-footer">
      <section id="pricing">
        <h1>Ціни</h1>
        <h2>Вартість основних послуг</h2>
        <ul className="price-list">
          <li>Монтаж СЕС — від 15000 грн</li>
          <li>Електропроводка — від 120 грн/м²</li>
          <li>Встановлення щитка — від 1000 грн</li>
          <li>Освітлення — від 200 грн/точка</li>
        </ul>
      </section>
    </main>
  );
}

export default PricingPage;
