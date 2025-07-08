import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import logo from "../img/logo.png";
import "../styles/HomePage.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/portfolio", label: t("nav.portfolio") },
    { path: "/reviews", label: t("nav.reviews") },
    { path: "/pricing", label: t("nav.pricing") },
    { path: "/contacts", label: t("nav.contacts") },
  ];

  return (
    <div className="app-wrapper">
      <header className="site-header" role="banner">
        <div className="header-container">
          <Link to="/" aria-label={t("nav.home")}>
            <img
              src={logo}
              alt="Логотип ПромЕлектроСервіс"
              className="logo-left"
              width="60"
              height="60"
              loading="eager"
              fetchpriority="high"
            />
          </Link>
          <nav aria-label="Головне меню">
            <ul className="nav-menu centered">
              {navItems.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    aria-current={location.pathname === path ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content" role="main">
        <Suspense
          fallback={
            <div className="loading-spinner" role="status" aria-live="polite">
              <div className="spinner" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/admin" element={<AdminPanel enableExport />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="footer minimized-footer sticky-footer" role="contentinfo">
        <div className="footer-top">
          <a href="tel:+380666229776" className="footer-link">📞 +380666229776</a>
          <a href="mailto:gdvolya@gmail.com" className="footer-link">✉️ gdvolya@gmail.com</a>
        </div>

        <div className="lang-switcher" aria-label="Перемикач мови">
          {[
            { lng: "uk", flag: "🇺🇦", title: "Українська" },
            { lng: "en", flag: "🇬🇧", title: "English" },
            { lng: "ru", flag: "🇷🇺", title: "Русский" },
          ].map(({ lng, flag, title }) => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              title={title}
              className={`lang-btn ${i18n.language === lng ? "active" : ""}`}
            >
              {flag}
            </button>
          ))}
        </div>

        <p>© 2025 ПромЕлектроСервіс. {t("footer.rights")}</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}
