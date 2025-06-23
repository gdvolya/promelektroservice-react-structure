import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "../styles/Layout.css";

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <HelmetProvider>
      <div className="layout">
        <header className="layout-header">
          <nav className="navbar">
            <Link to="/" className={pathname === "/" ? "active" : ""}>Головна</Link>
            <Link to="/portfolio" className={pathname === "/portfolio" ? "active" : ""}>Портфоліо</Link>
            <Link to="/pricing" className={pathname === "/pricing" ? "active" : ""}>Ціни</Link>
            <Link to="/contacts" className={pathname === "/contacts" ? "active" : ""}>Контакти</Link>
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
