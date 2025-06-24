import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <div className="container">
          {/* Логотип */}
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <img src="/img/logo.svg" alt="Promelektroservice" className="site-logo" />
            </Link>
          </div>

          {/* Кнопка-бургер */}
          <button
            className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
            aria-label="Toggle menu"
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Навігаційне меню */}
          <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
            <Link to="/portfolio" onClick={closeMenu}>Портфоліо</Link>
            <Link to="/pricing" onClick={closeMenu}>Послуги</Link>
            <Link to="/contacts" onClick={closeMenu}>Контакти</Link>
          </nav>
        </div>
      </header>

      <main className="site-content">{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-links">
            <Link to="/privacy">Політика конфіденційності</Link>
            <Link to="/terms">Умови використання</Link>
          </div>
          <div className="footer-contact">
            <span>☎ +38 (066) 622-97-76</span> |{" "}
            <a href="mailto:info@promelektroservice.com">info@promelektroservice.com</a>
          </div>
          <p>&copy; {new Date().getFullYear()} Promelektroservice. Всі права захищено.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
