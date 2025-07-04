import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "../styles/Layout.css";

const Layout = () => {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <HelmetProvider>
      <div className="layout">
        <header className="layout-header">
          <nav className="navbar" role="navigation" aria-label="Основна навігація">
            <Link to="/" className={isActive("/") ? "active" : ""} aria-current={isActive("/") ? "page" : undefined}>
              Головна
            </Link>
            <Link to="/portfolio" className={isActive("/portfolio") ? "active" : ""} aria-current={isActive("/portfolio") ? "page" : undefined}>
              Портфоліо
            </Link>
            <Link to="/pricing" className={isActive("/pricing") ? "active" : ""} aria-current={isActive("/pricing") ? "page" : undefined}>
              Ціни
            </Link>
            <Link to="/contacts" className={isActive("/contacts") ? "active" : ""} aria-current={isActive("/contacts") ? "page" : undefined}>
              Контакти
            </Link>
          </nav>
        </header>

        <main className="layout-content">
          <Outlet />
        </main>

        <footer className="layout-footer">
          <p>&copy; {new Date().getFullYear()} Promelektroservice. Усі права захищено.</p>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default Layout;
