import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// ✅ Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker зарегистрирован:', registration);
      })
      .catch(error => {
        console.warn('❌ Ошибка при регистрации Service Worker:', error);
      });
  });
}
