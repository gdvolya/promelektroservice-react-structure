import React, {
  Suspense,
  lazy,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
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

// react-icons
import {
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaSun,
  FaMoon,
} from "react-icons/fa";

// ленивые страницы
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.jsx"));
const ContactsPage = lazy(() => import("./pages/ContactsPage.jsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.jsx"));

// доступные языки
const languages = ["uk", "en", "ru"];

function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Тема (светлая/тёмная)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.remove("light-mode", "dark-mode");
    document.documentElement.classList.add(
      isDarkMode ? "dark-mode" : "light-mode"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // AOS анимации
  useEffect(() => {
    AOS.init({ once: true, duration: 700 });
  }, []);

  // текущий язык из URL
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

  // навигация
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

  // SEO мета
  const getPageMeta = useCallback(
    (pathname) => {
      const projectsData = t("portfolio.projects", { returnObjects: true });
      const basePath = "https://promelektroservice.vercel.app";
      const pathParts = pathname.split("/").filter(Boolean);

      let title, description, keywords, canonicalPath;
      const cleanPath = pathParts
        .slice(languages.includes(pathParts[0]) ? 1 : 0)
        .join("/");

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

      canonicalPath = cleanPath ? `/${cleanPath}` : "/";

      return {
        title,
        description,
        keywords,
        url: `${basePath}${pathname}`,
        canonical: `${basePath}${canonicalPath}`,
      };
    },
    [t]
  );

  const { title, description, keywords, url, canonical } =
    getPageMeta(location.pathname);

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
      </Helmet>

      {/* 🔹 Header */}
      <header className="site-header" role="banner">
        <div className="header-container">
          <Link
            to={`/${currentLang}/`}
            aria-label={t("nav.home")}
            className="logo-link"
          >
            <picture>
              <source srcSet={logoWebp} type="image/webp" />
              <img
                src={logoPng}
                alt="Логотип ПромЕлектроСервіс"
                className="logo-left"
                width={60}
                height={60}
              />
            </picture>
          </Link>

          <div className="right-controls">
            <nav aria-label="Main menu">
              <ul className="nav-menu centered" role="menubar">
                {navItems.map(({ path, label }) => {
                  const toPath =
                    path === "/" ? `/${currentLang}` : `/${currentLang}${path}`;
                  const isActive =
                    location.pathname === toPath ||
                    (toPath === `/${currentLang}` &&
                      location.pathname === `/${currentLang}/`);
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

            {/* переключатель темы */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={isDarkMode ? "Светлая тема" : "Тёмная тема"}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main-content" id="main-content" tabIndex={-1}>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="loading-spinner">
                <div className="spinner" />
                <p>{t("loading") || "Завантаження..."}</p>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:lang" element={<HomePage />} />
              <Route path="/:lang/portfolio" element={<PortfolioPage />} />
              <Route
                path="/:lang/portfolio/:id"
                element={<ProjectDetailPage />}
              />
              <Route path="/:lang/reviews" element={<ReviewsPage />} />
              <Route path="/:lang/pricing" element={<PricingPage />} />
              <Route path="/:lang/contacts" element={<ContactsPage />} />
              <Route path="/admin" element={<AdminPanel enableExport />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="footer-top">
          <a href="tel:+380666229776" className="footer-link">
            📞 +380666229776
          </a>
          <a href="mailto:info@promelektroservice.com" className="footer-link">
            ✉️ info@promelektroservice.com
          </a>
        </div>

        <div className="social-links">
          <a
            href="https://facebook.com/promelektroservice"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="social-link"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com/promelektroservice"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-link"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com/promelektroservice"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="social-link"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com/company/promelektroservice"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-link"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://youtube.com/@promelektroservice"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="social-link"
          >
            <FaYoutube />
          </a>
        </div>

        {/* языки */}
        <div className="lang-switcher">
          {languages.map((lng) => {
            const labels = { uk: "Українська", en: "English", ru: "Русский" };
            const flags = { uk: "🇺🇦", en: "🇬🇧", ru: "🇷🇺" };
            return (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`lang-btn ${currentLang === lng ? "active" : ""}`}
              >
                {flags[lng]} {labels[lng]}
              </button>
            );
          })}
        </div>
      </footer>
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
