import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import logo from "./img/logo.png";
import "./css/style.css";

// 🔁 Ленивая загрузка всех страниц
const HomePage = lazy(() => import("./pages/HomePage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app-wrapper">
          <header className="site-header" role="banner">
            <div className="header-container">
              <Link to="/" aria-label="Головна">
                <img
                  src={logo}
                  alt="Логотип ПромЕлектроСервіс"
                  className="logo-left"
                  width="60"
                  height="60"
                  fetchpriority="high"
                  loading="eager"
                />
              </Link>
              <nav aria-label="Головне меню" role="navigation">
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

          <main className="main-content" role="main">
            <Suspense fallback={<div className="loading-spinner" role="status" aria-live="polite"><div className="spinner" /></div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/admin" element={<AdminPanel enableExport={true} />} />
              </Routes>
            </Suspense>
          </main>

          <footer className="footer minimized-footer sticky-footer" role="contentinfo">
            <div className="footer-top">
              <a href="tel:+380666229776" className="footer-link">📞 +380666229776</a>
              <a href="mailto:gdvolya@gmail.com" className="footer-link">✉️ gdvolya@gmail.com</a>
            </div>
            <p>© 2025 ПромЕлектроСервіс. Всі права захищені.</p>
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
