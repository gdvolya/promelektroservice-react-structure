import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import ContactsPage from "./pages/ContactsPage";
import ReviewsPage from "./pages/ReviewsPage";
import PricingPage from "./pages/PricingPage";
import AdminPanel from "./pages/AdminPanel";
import logo from "./img/logo.png";
import "./css/style.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyADB_57F2kKA7HcxLnLpcqzr3ooi2sszMc",
  authDomain: "promelectroservice-cb179.firebaseapp.com",
  projectId: "promelectroservice-cb179",
  storageBucket: "promelectroservice-cb179.firebasestorage.app",
  messagingSenderId: "938821085661",
  appId: "1:938821085661:web:1eeb590842370bd23f2e34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Получение токена при загрузке сайта
getToken(messaging, { vapidKey: "BE6mx-nmfkaM-RJmDBA2rJVNYkQRX9Qayj4-zgSz4AM-IJFssiPlAA0XUAaGmlznUUDIpvkksUzzJbgS0glRKj8" })
  .then(currentToken => {
    if (currentToken) {
      console.log("FCM токен:", currentToken);
    } else {
      console.warn("Нет регистрационного токена. Разрешение не получено.");
    }
  })
  .catch(err => {
    console.error("Ошибка при получении токена:", err);
  });

onMessage(messaging, payload => {
  alert(`🔔 Повідомлення: ${payload.notification?.title}`);
});

export { db, messaging };

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <header>
          <div className="header-container">
            <img src={logo} alt="Логотип" className="logo-left" />
            <nav>
              <ul className="nav-menu centered">
                <li><Link to="/">Головна</Link></li>
                <li><Link to="/portfolio">Портфоліо</Link></li>
                <li><Link to="/reviews">Відгуки</Link></li>
                <li><Link to="/pricing">Ціни</Link></li>
                <li><Link to="/contacts">Контакти</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/admin" element={<AdminPanel enableExport={true} />} />
        </Routes>

        <footer className="footer minimized-footer sticky-footer">
          <div className="footer-top">
            <a href="tel:+380666229776" className="footer-link">📞 +380666229776</a>
            <a href="mailto:gdvolya@gmail.com" className="footer-link">✉️ gdvolya@gmail.com</a>
          </div>
          <p>© 2025 ПромЕлектроСервіс. Всі права захищені.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
