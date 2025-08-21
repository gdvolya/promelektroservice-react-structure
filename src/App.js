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
  const navigate = useNavigate();

  // Логика для дневного/ночного режима
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const body = document.body;
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  useEffect(() => {
    AOS.init({ once: true, duration: 700 });
  }, []);

  const currentLang = useMemo(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const langFromPath = pathParts[0];
    return languages.includes(langFromPath) ? langFromPath : i18n.language;
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
  
  const getPageMeta = useCallback(
    (pathname) => {
      const projectsData = t("portfolio.projects", { returnObjects: true });
      const basePath = "https://promelektroservice.vercel.app";
      const pathParts = pathname.split("/").filter(Boolean);
      
      let title, description, keywords, canonicalPath;
      const lang = languages.includes(pathParts[0]) ? pathParts[0] : i18n.language;
      const cleanPath = pathParts.slice(languages.includes(pathParts[0]) ? 1 : 0).join('/');
      
      const projectMatch = cleanPath.match(/^portfolio\/(\d+)/);

      if (projectMatch) {
        const projectIndex = parseInt(projectMatch[1], 10);
        const project = projectsData[projectIndex];
        if (project) {
          title = project.title;
          description = project.description;
          keywords = `${project.title}, ${project.type}, ${project.address}, електромонтаж, проект`;
        } else {
          title = t("projectNotFound.title");
          description = t("projectNotFound.description");
          keywords = t("meta.notFoundKeywords");
        }
      } else {
        const key = cleanPath || "home";
        title = t(`meta.${key}Title`);
        description = t(`meta.${key}Description`);
        keywords = t(`meta.${key}Keywords`);
      }

      canonicalPath = cleanPath ? `/${cleanPath}` : '/';

      return {
        title,
        description,
        keywords,
        url: `${basePath}${pathname}`,
        canonical: `${basePath}${canonicalPath}`,
      };
    },
    [t, i18n.language]
  );

  const { title, description, keywords, url, canonical } = getPageMeta(location.pathname);

  return (
    <>
      <Helmet>
        <html lang={currentLang} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={canonical} />
        {languages.map((lng) => (
          <link
            key={lng}
            rel="alternate"
            hrefLang={lng}
            href={`https://promelektroservice.vercel.app/${lng}${canonical === "/" ? "" : canonical}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://promelektroservice.vercel.app/" />
      </Helmet>

      <a href="#main-content" className="skip-link">
        {t("skipNav") || "Пропустити навігацію"}
      </a>

      <div className="app-wrapper">
        <header className="site-header" role="banner">
          <div className="header-container">
            <Link to={`/${currentLang}/`} aria-label={t("nav.home")} className="logo-link">
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
                  const toPath = path === "/" ? `/${currentLang}` : `/${currentLang}${path}`;
                  const isActive = location.pathname === toPath || (toPath === `/${currentLang}` && location.pathname === `/${currentLang}/`);
                  return (
                    <li key={path} role="none">
                      <Link
                        to={toPath}
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

            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

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
                <Route path="/:lang" element={<HomePage />} />
                <Route path="/:lang/portfolio" element={<PortfolioPage />} />
                <Route path="/:lang/portfolio/:id" element={<ProjectDetailPage />} />
                <Route path="/:lang/reviews" element={<ReviewsPage />} />
                <Route path="/:lang/pricing" element={<PricingPage />} />
                <Route path="/:lang/contacts" element={<ContactsPage />} />
                <Route path="/admin" element={<AdminPanel enableExport />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

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

          <div className="social-links" role="group" aria-label="Соціальні мережі">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Перейти на сторінку Twitter"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.901 1.144h3.68l-8.04 9.172L24 22.846h-5.064l-6.074-7.29L6.502 22.846H.886L10.96 9.58 1.405 1.144h5.16l4.634 6.784L18.901 1.144zM17.152 20.893h1.838L6.448 3.093H4.498l12.654 17.8z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Перейти на сторінку Facebook"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 11.2h2.5L17 8.5h-3c-.9 0-1.5-.6-1.5-1.5V5.5h3L18 3h-3.5C13.2 3 12 4.2 12 5.5v2.5H9.5V11h2.5v7h3V11.2z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Перейти на сторінку Instagram"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.16c3.2 0 3.6 0 4.8.06 1.1.06 1.7.2 2.2.4.6.2 1.1.5 1.6 1s.8 1 1 1.6c.2.5.3 1.1.4 2.2.06 1.2.06 1.6.06 4.8s0 3.6-.06 4.8c-.06 1.1-.2 1.7-.4 2.2-.2.6-.5 1.1-1 1.6s-1 .8-1.6 1c-.5.2-1.1.3-2.2.4-1.2.06-1.6.06-4.8.06s-3.6 0-4.8-.06c-1.1-.06-1.7-.2-2.2-.4-.6-.2-1.1-.5-1.6-1s-.8-1-1-1.6c-.2-.5-.3-1.1-.4-2.2-.06-1.2-.06-1.6-.06-4.8s0-3.6.06-4.8c.06-1.1.2-1.7.4-2.2.2-.6.5-1.1 1-1.6s1-.8 1.6-1c.5-.2 1.1-.3 2.2-.4 1.2-.06 1.6-.06 4.8-.06z" />
                <path d="M12 5.8a6.2 6.2 0 100 12.4A6.2 6.2 0 0012 5.8zm0 10.4a4.2 4.2 0 110-8.4 4.2 4.2 0 010 8.4z" />
                <path d="M17.4 5.2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
              </svg>
            </a>
          </div>

          <div className="lang-switcher" role="group" aria-label={t("langSelectorLabel") || "Вибір мови"}>
            {languages.map((lng) => {
              const labels = { uk: "Українська", en: "English", ru: "Русский" };
              const flags = { uk: "🇺🇦", en: "🇬🇧", ru: "🇷🇺" };
              const isActive = currentLang === lng;
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

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Analytics />
    </HelmetProvider>
  );
}