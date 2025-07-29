import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "../styles/ContactsPage.css";

const ContactsPage = () => {
  const { t } = useTranslation();

  return (
    <main className="contacts-page">
      <Helmet>
        <title>{t("meta.contactsTitle")}</title>
        <meta
          name="description"
          content={t("meta.contactsDescription")}
        />
      </Helmet>

      <h1>📞 {t("contacts.heading")}</h1>
      <p>{t("contacts.description")}</p>

      <div className="contact-info">
        <section aria-labelledby="contact-phone">
          <h2 id="contact-phone">{t("contacts.phoneLabel")}</h2>
          <a href="tel:+380666229776">+38 (066) 622-97-76</a>
        </section>

        <section aria-labelledby="contact-email">
          <h2 id="contact-email">{t("contacts.emailLabel")}</h2>
          <a href="mailto:info@promelektroservice.com">
            info@promelektroservice.com
          </a>
        </section>

        <section aria-labelledby="contact-address">
          <h2 id="contact-address">{t("contacts.addressLabel")}</h2>
          <p>{t("contacts.address")}</p>
        </section>

        <section aria-labelledby="contact-form">
          <h2 id="contact-form">{t("contacts.formTitle")}</h2>
          <form
            action="https://formspree.io/f/xeogalqn"
            method="POST"
            className="contact-form"
            aria-describedby="form-description"
          >
            <div className="form-group">
              <label htmlFor="name">{t("contacts.nameLabel")}</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={t("contacts.namePlaceholder")}
                required
                aria-required="true"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">{t("contacts.emailLabel")}</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t("contacts.emailPlaceholder")}
                required
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t("contacts.phoneLabel")}</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder={t("contacts.phonePlaceholder")}
                aria-label={t("contacts.phoneLabel")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">{t("contacts.messageLabel")}</label>
              <textarea
                id="message"
                name="message"
                placeholder={t("contacts.messagePlaceholder")}
                rows={5}
                required
                aria-required="true"
              />
            </div>

            <button type="submit" aria-label={t("contacts.sendBtn")}>
              📨 {t("contacts.sendBtn")}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ContactsPage;
