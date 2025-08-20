import React, { Suspense, lazy, useEffect, useCallback, useMemo } from "react";
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

  // ✨ Единая инициализация AOS для всего приложения
  useEffect(() => {
    AOS.init({ once: true, duration: 700 });
  }, []);

  // Получаем текущий язык из URL, если его нет — из localStorage, а затем по умолчанию
  const currentLang = useMemo(() => {
    const pathParts = location.pathname.split("/");
    const langFromPath = pathParts[1];
    return languages.includes(langFromPath) ? langFromPath : i18n.language;
  }, [location.pathname, i18n.language]);

  // Смена языка и обновление URL
  const changeLanguage = useCallback(
    (lng) => {
      // Исключаем лишние слэши, чтобы путь всегда был корректным
      const pathWithoutLang = location.pathname.startsWith(`/${currentLang}`)
        ? location.pathname.substring(3)
        : location.pathname;
      const newPath = `/${lng}${pathWithoutLang === "/" ? "" : pathWithoutLang}`;

      i18n.changeLanguage(lng);
      localStorage.setItem("i18nextLng", lng);
      navigate(newPath);
    },
    [currentLang, i18n, location.pathname, navigate]
  );

  // Обновление языка, если пользователь изменил его в адресной строке
  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, i18n]);

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
      // Убираем языковой префикс для корректной генерации мета-тегов
      const pathParts = pathname.split("/");
      const cleanPathname = pathParts[1] && languages.includes(pathParts[1])
        ? `/${pathParts.slice(2).join('/')}`
        : pathname;

      const metaKey = cleanPathname.split("/")[1] || "home";
      const projectMatch = cleanPathname.match(/\/portfolio\/([^/]+)/);

      const basePath = "https://promelektroservice.vercel.app";

      if (projectMatch) {
        return {
          title: t("meta.projectTitle", { projectName: projectMatch[1] }),
          description: t("meta.projectDescription", { projectName: projectMatch[1] }),
          url: `${basePath}${pathname}`,
          canonical: `${basePath}${cleanPathname}`,
        };
      }

      return {
        title: t(`meta.${metaKey}Title`),
        description: t(`meta.${metaKey}Description`),
        url: `${basePath}${pathname}`,
        canonical: `${basePath}${cleanPathname}`,
      };
    },
    [t]
  );

  const { title, description, url, canonical } = getPageMeta(location.pathname);

  return (
    <>
      <Helmet>
        <html lang={currentLang} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={canonical} />
        {languages.map((lng) => (
          <link
            key={lng}
            rel="alternate"
            hrefLang={lng}
            href={`https://promelektroservice.vercel.app/${lng}${canonical}`}
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
                  const isActive = location.pathname === `/${currentLang}${path}` || (path === "/" && location.pathname === `/${currentLang}`);
                  return (
                    <li key={path} role="none">
                      <Link
                        to={`/${currentLang}${path}`}
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
                <Route path="/:lang/portfolio/:projectId" element={<ProjectDetailPage />} />
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

// Обертка
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