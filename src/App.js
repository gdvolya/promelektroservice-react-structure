import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoPng from "./img/logo.png";
import logoWebp from "./img/logo.webp";
import "./css/style.css";
import "./i18n";

// 🔁 Ленивая загрузка страниц
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.jsx"));
const ContactsPage = lazy(() => import("./pages/ContactsPage.jsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.jsx"));
const HelmetProvider = lazy(() => import("react-helmet-async").then(mod => ({ default: mod.HelmetProvider })));
const Helmet = lazy(() => import("react-helmet-async").then(mod => ({ default: mod.Helmet })));

function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      import("aos").then((AOS) => AOS.init());
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
      <Suspense fallback={null}>
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
      </Suspense>

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
                  width="60"
                  height="60"
                  loading="eager"
                  fetchpriority="high"
                />
              </picture>
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

        <main className="main-content" role="main" style={{ minHeight: "60vh" }}>
          {location.pathname === "/" && (
            <picture style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}>
              <source
                srcSet="/img/background@2x.webp"
                type="image/webp"
                media="(min-width: 768px)"
              />
              <img
                src="/img/background@2x.webp"
                alt="Hero background"
                width="1920"
                height="1080"
                fetchpriority="high"
                loading="eager"
              />
            </picture>
          )}

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
              <Route path="/portfolio/:projectId" element={<ProjectDetailPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/admin" element={<AdminPanel enableExport />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="footer minimized-footer sticky-footer" role="contentinfo" style={{ minHeight: "80px" }}>
          <div className="footer-top">
            <a href="tel:+380666229776" className="footer-link">📞 +380666229776</a>
            <a href="mailto:info@promelektroservice.com" className="footer-link">✉️ info@promelektroservice.com</a>
          </div>

          <div className="lang-switcher" role="group" aria-label="Language selector">
            {["uk", "en", "ru"].map((lng) => {
              const labels = { uk: "Українська", en: "English", ru: "Русский" };
              const flags = { uk: "🇺🇦", en: "🇬🇧", ru: "🇷🇺" };
              return (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  title={labels[lng]}
                  aria-label={labels[lng]}
                  className={`lang-btn ${i18n.language === lng ? "active" : ""}`}
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
    <Suspense fallback={null}>
      <HelmetProvider>
        <Router>
          <AppContent />
        </Router>
      </HelmetProvider>
    </Suspense>
  );
}
