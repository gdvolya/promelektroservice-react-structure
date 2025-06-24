import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

export default function HomePage() {
  return (
    <main className="home-page">
      {/* Герой-секция с фоном */}
      <section className="hero" role="banner" aria-label="Промелектросервіс — електромонтаж під ключ">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Promelektroservice</h1>
          <p className="hero-subtitle">
            Якісний електромонтаж для дому, офісу та бізнесу у Києві.
          </p>
          <div className="hero-buttons">
            <Link to="/portfolio" className="btn primary">Наші проекти</Link>
            <Link to="/contacts" className="btn secondary">Зв'язатися з нами</Link>
          </div>
        </div>
      </section>

      {/* Секція з перевагами */}
      <section className="features">
        <h2 className="features-title">Чому обирають нас?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="/icons/speed.svg" className="feature-icon" alt="Швидкість" />
            <h3>Швидкість</h3>
            <p>Працюємо швидко, без затримок і простоїв.</p>
          </div>
          <div className="feature-card">
            <img src="/icons/quality.svg" className="feature-icon" alt="Якість" />
            <h3>Якість</h3>
            <p>Високі стандарти і надійні рішення для кожного проекту.</p>
          </div>
          <div className="feature-card">
            <img src="/icons/secure.svg" className="feature-icon" alt="Безпека" />
            <h3>Безпека</h3>
            <p>Працюємо тільки з сертифікованим обладнанням.</p>
          </div>
        </div>
      </section>

      {/* Секція для вибору мови */}
      <section className="language-switcher">
        <button>UA</button>
        <button>EN</button>
        <button>RU</button>
      </section>
    </main>
  );
}
