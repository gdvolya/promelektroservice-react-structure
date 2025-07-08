import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "../styles/ContactsPage.css";

const ContactsPage = () => {
  const { t } = useTranslation();

  return (
    <main className="contacts-page">
      <Helmet>
        <title>{t("contacts.metaTitle")}</title>
        <meta name="description" content={t("contacts.metaDescription")} />
      </Helmet>

      <h1>📞 {t("contacts.heading")}</h1>
      <p>{t("contacts.intro")}</p>

      <div className="contact-info">
        <section aria-labelledby="contact-phone">
          <h2 id="contact-phone">{t("contacts.phone")}</h2>
          <a href="tel:+380666229776">+38 (066) 622-97-76</a>
        </section>

        <section aria-labelledby="contact-email">
          <h2 id="contact-email">Email</h2>
          <a href="mailto:info@promelektroservice.com">info@promelektroservice.com</a>
        </section>

        <section aria-labelledby="contact-address">
          <h2 id="contact-address">{t("contacts.addressTitle")}</h2>
          <p>{t("contacts.addressValue")}</p>
        </section>
      </div>
    </main>
  );
};

export default ContactsPage;
