import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedinIn,
  faYoutube,
  faTelegram,
  faViber,
} from "@fortawesome/free-brands-svg-icons";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "../css/style.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} ПромЕлектроСервіс.{" "}
        {t("allRightsReserved")}
      </p>

      {/* 🔹 Контакты */}
      <div className="footer-contacts">
        <a
          href="tel:+380666229776"
          className="footer-link"
          aria-label={t("phoneLabel") || "Телефон"}
        >
          <FontAwesomeIcon icon={faPhone} /> +380666229776
        </a>
        <a
          href="mailto:info@promelektroservice.com"
          className="footer-link"
          aria-label={t("emailLabel") || "Email"}
        >
          <FontAwesomeIcon icon={faEnvelope} /> info@promelektroservice.com
        </a>
      </div>

      {/* 🔹 Соцсети */}
      <div className="social-links">
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="social-link"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="social-link"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="social-link"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="social-link"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
        <a
          href="https://youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="social-link"
        >
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <a
          href="https://t.me/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="social-link"
        >
          <FontAwesomeIcon icon={faTelegram} />
        </a>
        <a
          href="viber://chat?number=+380XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Viber"
          className="social-link"
        >
          <FontAwesomeIcon icon={faViber} />
        </a>
      </div>
    </footer>
  );
}
