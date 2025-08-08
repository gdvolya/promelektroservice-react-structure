import React, { Suspense, lazy, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import logoPng from "./img/logo.png";
import logoWebp from "./img/logo.webp";
import "./css/style.css";
import "./i18n";

// Ленивая загрузка страниц
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

  // Мемоизированная функция для смены языка
  const changeLanguage = useCallback((lng) => {
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
      localStorage.setItem("i18nextLng", lng);
    }
  }, [i18n]);

  // Инициализация AOS только при заходе на главную страницу
  useEffect(() => {
    if (location.pathname === "/") {
      import("aos").then((AOS) => {
        AOS.init({ once: true, duration: 700 });
      });
    }
  }, [location.pathname]);

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
        <title>{`ПромЕлектроСервіс — ${t("meta.title") || "електромонтажні послуги"}`}</title>
        <meta
          name="description"
          content={t("meta.description") || "Професійні електромонтажні роботи будь-якої складності."}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/img/background@2x.webp" type="image/webp" fetchpriority="high" />
        <link rel="preload" as="image" href="/img/logo.webp" type="image/webp" fetchpriority="high" />
      </Helmet>

      <div className="app-wrapper">
        <header className="site-header" role="banner">
          <div className="header-container">
            <Link to="/" aria-label={t("nav.home")} className="logo-link">
              <picture>
                <source srcSet={logoWebp} type="image/webp" />
                <img
                  src={logoPng}
                  alt="Логотип ПромЕлектроСервіс"
                  className="logo-left"
                  width={60}
                  height={60}
                  loading="eager"
                  fetchpriority="high"
                />
              </picture>
            </Link>

            <nav aria-label={t("nav.mainMenu") || "Головне меню"}>
              <ul className="nav-menu centered">
                {navItems.map(({ path, label }) => {
                  const isActive = location.pathname === path;
                  return (
                    <li key={path}>
                      <Link
                        to={path}
                        className={isActive ? "active" : ""}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </header>

        <main className="main-content" role="main" style={{ minHeight: "60vh" }}>
          {location.pathname === "/" && (
            // Предзагрузка фонового изображения для LCP
            <img
              src="/img/background@2x.webp"
              alt=""
              aria-hidden="true"
              width={0}
              height={0}
              style={{ display: "none" }}
              fetchpriority="high"
              loading="eager"
            />
          )}

          <Suspense
            fallback={
              <div className="loading-spinner" role="status" aria-live="polite" aria-label="Завантаження...">
                <div className="spinner" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:projectId" element={<ProjectDetailPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/admin" element={<AdminPanel enableExport />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <footer
          className="footer minimized-footer sticky-footer"
          role="contentinfo"
          style={{ minHeight: 80 }}
        >
          <div className="footer-top">
            <a href="tel:+380666229776" className="footer-link" aria-label="Телефон">
              📞 +380666229776
            </a>
            <a href="mailto:info@promelektroservice.com" className="footer-link" aria-label="Email">
              ✉️ info@promelektroservice.com
            </a>
          </div>

          <div className="lang-switcher" role="group" aria-label={t("langSelectorLabel") || "Вибір мови"}>
            {["uk", "en", "ru"].map((lng) => {
              const labels = { uk: "Українська", en: "English", ru: "Русский" };
              const flags = { uk: "🇺🇦", en: "🇬🇧", ru: "🇷🇺" };
              const isActive = i18n.language === lng;
              return (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  title={labels[lng]}
                  aria-label={labels[lng]}
                  className={`lang-btn${isActive ? " active" : ""}`}
                  type="button"
                >
                  {flags[lng]}
                </button>
              );
            })}
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
