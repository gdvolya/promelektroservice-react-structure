import React from "react";
import { useTranslation } from "react-i18next";
import SeoHelmet from "../components/SeoHelmet";
import "../styles/ContactsPage.css";

const ContactsPage = () => {
  const { t } = useTranslation();

  return (
    <main className="contacts-page">
      <SeoHelmet
        title={t("contacts.meta.title")}
        description={t("contacts.meta.description")}
        url="https://promelektroservice.com/contacts"
      />

      <section className="contacts-section">
        <h1>{t("contacts.title")}</h1>
        <p>{t("contacts.subtitle")}</p>

        <div className="contact-info">
          <div className="contact-item">
            <strong>{t("contacts.phone")}:</strong>
            <a href="tel:+380666229776">+38 (066) 622-97-76</a>
          </div>
          <div className="contact-item">
            <strong>{t("contacts.email")}:</strong>
            <a href="mailto:info@promelektroservice.com">info@promelektroservice.com</a>
          </div>
          <div className="contact-item">
            <strong>{t("contacts.address")}:</strong>
            <p>вул. Прикладна, 1, Київ, Україна</p>
          </div>
        </div>

        <div className="map-container">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2539.4441339336467!2d30.51613641573127!3d50.45010047947209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf0696df3f0b%3A0x1ef18b9b42e2b6c7!2z0LLRg9C70LjRhtGPINCf0L7Qu9C10LrRgtC40YfQvdC-0LUg0KHQtdGA0LrQuNC5INCY0L7QutCw!5e0!3m2!1suk!2sua!4v1625745742505!5m2!1suk!2sua"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </main>
  );
};

export default ContactsPage;
