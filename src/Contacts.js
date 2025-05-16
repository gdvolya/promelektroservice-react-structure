import React from "react";

function ContactsPage() {
  return (
    <main className="page-with-footer">
      <section id="contacts">
        <h2>Контакти</h2>
        <p>Заповніть форму і ми з вами зв'яжемось</p>
        <form
          action="https://formspree.io/f/xeogalqn"
          method="POST"
          className="contact-form"
          target="_blank"
        >
          <input type="text" name="name" placeholder="Ваше ім’я" required />
          <input type="email" name="email" placeholder="Ваш email" required />
          <input type="tel" name="phone" placeholder="Ваш номер телефону" required pattern="\+?[0-9\-\s]{7,15}" />
          <textarea name="message" placeholder="Ваше повідомлення" required></textarea>
          <div style={{ textAlign: "center" }}>
            <button type="submit" className="btn">Надіслати</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ContactsPage;

