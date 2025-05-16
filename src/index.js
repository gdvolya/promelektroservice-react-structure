import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import { register } from './serviceWorkerRegistration';
register();




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
