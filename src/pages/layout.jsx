import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import "../styles/Layout.css";

const Layout = () => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <HelmetProvider>
      <div className="layout">
        <header className="layout-header">
          <nav className="navbar" role="navigation" aria-label="Main Navigation">
            <Link to="/" className={isActive("/") ? "active" : ""} aria-current={isActive("/") ? "page" : undefined}>
              {t("nav.home")}
            </Link>
            <Link to="/portfolio" className={isActive("/portfolio") ? "active" : ""} aria-current={isActive("/portfolio") ? "page" : undefined}>
              {t("nav.portfolio")}
            </Link>
            <Link to="/reviews" className={isActive("/reviews") ? "active" : ""} aria-current={isActive("/reviews") ? "page" : undefined}>
              {t("nav.reviews")}
            </Link>
            <Link to="/pricing" className={isActive("/pricing") ? "active" : ""} aria-current={isActive("/pricing") ? "page" : undefined}>
              {t("nav.pricing")}
            </Link>
            <Link to="/contacts" className={isActive("/contacts") ? "active" : ""} aria-current={isActive("/contacts") ? "page" : undefined}>
              {t("nav.contacts")}
            </Link>

            <div className="lang-switcher" role="group" aria-label="Language selector">
              <button onClick={() => changeLanguage("uk")} aria-label="Українська мова">
                🇺🇦
              </button>
              <button onClick={() => changeLanguage("en")} aria-label="English language">
                🇬🇧
              </button>
              <button onClick={() => changeLanguage("ru")} aria-label="Русский язык">
                🇷🇺
              </button>
            </div>
          </nav>
        </header>

        <main className="layout-content">
          <Outlet />
        </main>

        <footer className="layout-footer">
          <p>&copy; {new Date().getFullYear()} Promelektroservice. {t("footer.rights") || "Усі права захищено."}</p>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default Layout;
