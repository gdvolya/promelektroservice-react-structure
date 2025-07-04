import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/ContactsPage.css";

const ContactsPage = () => {
  return (
    <main className="contacts-page">
      <Helmet>
        <title>Контакти — Promelektroservice</title>
        <meta
          name="description"
          content="Зв’яжіться з Promelektroservice для замовлення послуг або консультації."
        />
      </Helmet>

      <h1>📞 Контакти</h1>
      <p>Ми завжди готові допомогти вам з електромонтажем або консультацією.</p>

      <div className="contact-info">
        <section aria-labelledby="contact-phone">
          <h2 id="contact-phone">Телефон</h2>
          <a href="tel:+380666229776">+38 (066) 622-97-76</a>
        </section>

        <section aria-labelledby="contact-email">
          <h2 id="contact-email">Email</h2>
          <a href="mailto:info@promelektroservice.com">info@promelektroservice.com</a>
        </section>

        <section aria-labelledby="contact-address">
          <h2 id="contact-address">Адреса</h2>
          <p>м. Київ, вул. Прикладна, 1</p>
        </section>
      </div>
    </main>
  );
};

export default ContactsPage;
