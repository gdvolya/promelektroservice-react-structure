// Импорт React и ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// Создание компонента для главной страницы
const App = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">ПромЕлектроСервіс</h1>
        <p className="hero-subtitle">Професійні електромонтажні роботи будь-якої складності</p>
        <div className="hero-buttons">
          <a href="#" className="btn primary">Замовити послугу</a>
          <a href="#" className="btn secondary">Дізнатися більше</a>
        </div>
      </div>
    </div>
  );
};

// Получаем корневой элемент, в который будем рендерить наше приложение
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим компонент App в root
root.render(<App />);
