import React, { Suspense, lazy, useEffect, useCallback, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import logoPng from "./img/logo.png";
import logoWebp from "./img/logo.webp";
import "./css/style.css";
import "./i18n";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaMoon, FaSun } from "react-icons/fa";

// 🔹 Динамическая загрузка страниц
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.jsx"));
const ContactsPage = lazy(() => import("./pages/ContactsPage.jsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.jsx"));

// 🔹 Доступные языки
const languages = ["uk", "en", "ru"];

function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Темная/светлая тема
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(isDarkMode ? "dark-mode" : "light-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // 🔹 Анимации
  useEffect(() => {
    AOS.init({ once: true, duration: 700 });
  }, []);

  // 🔹 Язык из URL
  const currentLang = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return languages.includes(parts[0]) ? parts[0] : i18n.language;
  }, [location.pathname, i18n.language]);

  const changeLanguage = useCallback(
    (lng) => {
      const pathWithoutLang = location.pathname.startsWith(`/${currentLang}`)
        ? location.pathname.substring(currentLang.length + 1)
        : location.pathname;
      const newPath = `/${lng}${pathWithoutLang === "/" ? "" : pathWithoutLang}`;

      i18n.changeLanguage(lng);
      localStorage.setItem("i18nextLng", lng);
      navigate(newPath);
    },
    [currentLang, i18n, location.pathname, navigate]
  );

  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, i18n]);

  // 🔹 Навигация
  const navItems = useMemo(
    () => [
      { path: "/", label: t("nav.home") },
      { path: "/portfolio", label: t("nav.portfolio") },
      { path: "/reviews", label: t("nav.reviews") },
      { path: "/pricing", label: t("nav.pricing") },
      { path: "/contacts", label: t("nav.contacts") },
    ],
    [t]
  );

  return (
    <>
      <div className="app-wrapper">
        <header className="site-header">
          <Link to={`/${currentLang}/`} className="logo-link">
            <picture>
              <source srcSet={logoWebp} type="image/webp" />
              <img src={logoPng} alt="ПромЕлектроСервіс логотип" className="logo" />
            </picture>
          </Link>
          <nav className="main-nav">
            <ul className="nav-list">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/${currentLang}${item.path}`}
                    className={`nav-link ${location.pathname.startsWith(`/${currentLang}${item.path}`) ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-controls">
            {/* 🔹 Переключатель темы */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={t("themeToggle")}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* 🔹 Переключатель языка */}
            <div className="lang-switcher" role="group" aria-label={t("langSelectorLabel") || "Вибір мови"}>
              {languages.map((lng) => {
                const labels = { uk: "Українська", en: "English", ru: "Русский" };
                return (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    title={labels[lng]}
                    aria-label={labels[lng]}
                    className={`lang-btn ${currentLang === lng ? "active" : ""}`}
                  >
                    {lng.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <main className="main-content">
          <ErrorBoundary>
            <Suspense fallback={<div className="loading-spinner">{t("loading")}</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/:lang" element={<HomePage />} />
                <Route path="/:lang/portfolio" element={<PortfolioPage />} />
                <Route path="/:lang/reviews" element={<ReviewsPage />} />
                <Route path="/:lang/pricing" element={<PricingPage />} />
                <Route path="/:lang/contacts" element={<ContactsPage />} />
                <Route path="/:lang/admin" element={<AdminPanel />} />
                <Route path="/:lang/portfolio/:id" element={<ProjectDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        <footer className="site-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>{t("footer.contacts")}</h4>
              <p>{t("footer.phone")}: <a href="tel:+380972031603">+38 (097) 203 16 03</a></p>
              <p>{t("footer.email")}: <a href="mailto:info@promelektroservice.com">info@promelektroservice.com</a></p>
            </div>

            <div className="footer-section">
              <h4>{t("footer.address")}</h4>
              <p>{t("contacts.address")}</p>
            </div>

            <div className="footer-section social-links-container">
              <h4>{t("footer.followUs")}</h4>
              <a href="https://linkedin.com/company/promelektroservice" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://youtube.com/@promelektroservice" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} ПромЕлектроСервіс. {t("footer.rightsReserved")}</p>
        </footer>
      </div>
      <Analytics />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}