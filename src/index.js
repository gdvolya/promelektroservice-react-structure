import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// ❌ Временное отключение Service Worker для исправления ошибок кэширования
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
    console.log('✅ Service Worker успешно отменен.');
  });
}

// Закомментированная старая регистрация:
/*
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
*/