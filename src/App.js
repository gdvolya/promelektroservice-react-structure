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

// 🔹 Импорт компонента подвала
import Footer from "./components/Footer";

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

  const currentLang = useMemo(() => {
    const langFromPath = location.pathname.split("/")[1];
    return languages.includes(langFromPath) ? langFromPath : "uk";
  }, [location.pathname]);

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
    const newPath = `/${lng}${location.pathname.substring(3)}`;
    navigate(newPath);
  }, [i18n, location.pathname, navigate]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  const getProjectPath = useCallback((id) => `/${currentLang}/portfolio/${id}`, [currentLang]);

  return (
    <div className="app-wrapper">
      <Helmet>
        <html lang={currentLang} />
      </Helmet>
      <header className="site-header">
        <div className="header-top">
          <Link to={`/${currentLang}/`}>
            <picture className="logo">
              <source srcSet={logoWebp} type="image/webp" />
              <img src={logoPng} alt="ПромЕлектроСервіс" width="60" height="60" />
            </picture>
          </Link>
          <nav className="main-nav">
            <Link to={`/${currentLang}/`} className="nav-link">
              {t("nav.home")}
            </Link>
            <Link to={`/${currentLang}/portfolio`} className="nav-link">
              {t("nav.portfolio")}
            </Link>
            <Link to={`/${currentLang}/pricing`} className="nav-link">
              {t("nav.pricing")}
            </Link>
            <Link to={`/${currentLang}/reviews`} className="nav-link">
              {t("nav.reviews")}
            </Link>
            <Link to={`/${currentLang}/contacts`} className="nav-link">
              {t("nav.contacts")}
            </Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/:lang" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/:lang/portfolio" element={<PortfolioPage getProjectPath={getProjectPath} />} />
            <Route path="/:lang/portfolio/:projectId" element={<ProjectDetailPage />} />
            <Route path="/:lang/contacts" element={<ContactsPage />} />
            <Route path="/:lang/reviews" element={<ReviewsPage />} />
            <Route path="/:lang/pricing" element={<PricingPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* ✅ Заменено на компонент: */}
      <Footer />

      <Analytics />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </BrowserRouter>
  );
}