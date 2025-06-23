import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <div className="container">
          <div className="logo">
            <Link to="/">Promelektroservice</Link>
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

          <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
            <Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>
              Портфоліо
            </Link>
            <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
              Послуги
            </Link>
            <Link to="/contacts" onClick={() => setIsMenuOpen(false)}>
              Контакти
            </Link>
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
            <a href="mailto:info@promelektroservice.com">
              info@promelektroservice.com
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} Promelektroservice. Всі права захищено.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
