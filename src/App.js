import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import logo from "./img/logo.png";
import "./css/style.css";

// Ленивая загрузка всех страниц
const HomePage = lazy(() => import("./HomePage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

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

        <Suspense fallback={<div>Завантаження сторінки...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/admin" element={<AdminPanel enableExport={true} />} />
          </Routes>
        </Suspense>

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
