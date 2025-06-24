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

      <h1>Контакти</h1>
      <p>Ми завжди готові допомогти!</p>
      <div className="contact-info">
        <div>
          <h2>Телефон</h2>
          <a href="tel:+380666229776">+38 (066) 622-97-76</a>
        </div>
        <div>
          <h2>Email</h2>
          <a href="mailto:info@promelektroservice.com">info@promelektroservice.com</a>
        </div>
        <div>
          <h2>Адреса</h2>
          <p>м. Київ, вул. Прикладна, 1</p>
        </div>
      </div>
    </main>
  );
};

export default ContactsPage;
