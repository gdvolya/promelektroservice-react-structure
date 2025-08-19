import React, { Suspense, lazy, useEffect, useCallback, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./components/ErrorBoundary";
import logoPng from "./img/logo.png";
import logoWebp from "./img/logo.webp";
import "./css/style.css";
import "./i18n";

// Динамическая загрузка страниц
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.jsx"));
const ContactsPage = lazy(() => import("./pages/ContactsPage.jsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.jsx"));

// Доступные языки
const languages = ["uk", "en", "ru"];

function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Смена языка
  const changeLanguage = useCallback(
    (lng) => {
      if (i18n.language !== lng) {
        i18n.changeLanguage(lng);
        localStorage.setItem("i18nextLng", lng);
      }
    },
    [i18n]
  );

  // Инициализация AOS только на главной
  useEffect(() => {
    if (location.pathname === "/") {
      import("aos").then((AOS) => {
        AOS.init({ once: true, duration: 700 });
      });
    }
  }, [location.pathname]);

  // Навигация
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

  // Мета-теги
  const getPageMeta = useCallback(
    (pathname) => {
      const metaKey = pathname.split("/")[1] || "home";
      const projectMatch = pathname.match(/\/portfolio\/([^/]+)/);

      if (projectMatch) {
        return {
          title: t("meta.projectTitle", { projectName: projectMatch[1] }),
          description: t("meta.projectDescription", { projectName: projectMatch[1] }),
          url: `https://promelektroservice.vercel.app/${i18n.language}${pathname}`,
          canonical: `https://promelektroservice.vercel.app${pathname}`,
        };
      }

      return {
        title: t(`meta.${metaKey}Title`),
        description: t(`meta.${metaKey}Description`),
        url: `https://promelektroservice.vercel.app/${i18n.language}${pathname}`,
        canonical: `https://promelektroservice.vercel.app${pathname}`,
      };
    },
    [t, i18n.language]
  );

  const { title, description, url, canonical } = getPageMeta(location.pathname);

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={canonical} />
        <link rel="preload" as="image" href={logoWebp} type="image/webp" />
        <link rel="preload" as="image" href={logoPng} type="image/png" />
        {languages.map((lng) => (
          <link
            key={lng}
            rel="alternate"
            hrefLang={lng}
            href={`https://promelektroservice.vercel.app/${lng}${location.pathname}`}
          />
        ))}
      </Helmet>

      <a href="#main-content" className="skip-link">
        {t("skipNav") || "Пропустити навігацію"}
      </a>

      <div className="app-wrapper">
        {/* Хедер */}
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
                  decoding="async"
                />
              </picture>
            </Link>

            <nav aria-label={t("nav.mainMenu") || "Головне меню"}>
              <ul className="nav-menu centered" role="menubar">
                {navItems.map(({ path, label }) => {
                  const isActive = location.pathname === path;
                  return (
                    <li key={path} role="none">
                      <Link
                        to={path}
                        className={isActive ? "active" : ""}
                        aria-current={isActive ? "page" : undefined}
                        role="menuitem"
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

        {/* Контент */}
        <main className="main-content" role="main" id="main-content" tabIndex={-1}>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="loading-spinner" role="status" aria-live="polite">
                  <div className="spinner" aria-hidden="true" />
                  <p>{t("loading") || "Завантаження..."}</p>
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
          </ErrorBoundary>
        </main>

        {/* Футер */}
        <footer className="footer sticky-footer" role="contentinfo">
          <div className="footer-top">
            <a href="tel:+380666229776" className="footer-link" aria-label={t("phoneLabel") || "Телефон"}>
              <span aria-hidden="true">📞</span> +380666229776
            </a>
            <a
              href="mailto:info@promelektroservice.com"
              className="footer-link"
              aria-label={t("emailLabel") || "Email"}
            >
              <span aria-hidden="true">✉️</span> info@promelektroservice.com
            </a>
          </div>

          <div className="lang-switcher" role="group" aria-label={t("langSelectorLabel") || "Вибір мови"}>
            {languages.map((lng) => {
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
                  <span aria-hidden="true">{flags[lng]}</span>
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

// Обертка
export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
