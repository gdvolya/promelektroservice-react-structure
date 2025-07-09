import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import logo from "./img/logo.png";
import "./css/style.css";
import "./i18n";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.jsx"));
const ContactsPage = lazy(() => import("./pages/ContactsPage.jsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.jsx"));

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
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>ПромЕлектроСервіс — {t("meta.title") || "електромонтажні послуги"}</title>
        <meta
          name="description"
          content={t("meta.description") || "Професійні електромонтажні роботи будь-якої складності."}
        />
      </Helmet>

      <div className="app-wrapper">
        <header className="site-header" role="banner">
          <div className="header-container">
            <Link to="/" aria-label={t("nav.home")} className="logo-link">
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
              <Route path="/portfolio/:projectId" element={<ProjectDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="footer minimized-footer sticky-footer" role="contentinfo">
          <div className="footer-top">
            <a href="tel:+380666229776" className="footer-link">📞 +380666229776</a>
            <a href="mailto:info@promelektroservice.com" className="footer-link">✉️ info@promelektroservice.com</a>
          </div>

          <div className="lang-switcher" role="group" aria-label="Language selector">
            {[
              { lng: "uk", flag: "🇺🇦", label: "Українська" },
              { lng: "en", flag: "🇬🇧", label: "English" },
              { lng: "ru", flag: "🇷🇺", label: "Русский" },
            ].map(({ lng, flag, label }) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                title={label}
                aria-label={label}
                className={`lang-btn ${i18n.language === lng ? "active" : ""}`}
              >
                {flag}
              </button>
            ))}
          </div>

          <p>© {new Date().getFullYear()} Promelektroservice. {t("footer.rights")}</p>
        </footer>
      </div>
    </>
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
