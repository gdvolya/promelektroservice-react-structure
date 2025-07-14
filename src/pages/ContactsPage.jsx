import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import "../styles/ContactsPage.css";

// Подключаем Firestore для работы с базой данных
let db = null;

const ContactsPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      if (!db) {
        const firebase = await import("../firebaseLazy");
        db = firebase.db;
      }

      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

      // Проверяем, что все данные формы заполнены
      if (!form.name || !form.email || !form.message) {
        setStatus("error");
        setLoading(false);
        return;
      }

      // Добавляем данные в Firestore
      await addDoc(collection(db, "submissions"), {
        ...form,
        createdAt: serverTimestamp(),
      });

      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });  // Очищаем форму
    } catch (err) {
      console.error("Помилка надсилання форми:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contacts-page">
      <Helmet>
        <title>Контакти — ПромЕлектроСервіс</title>
        <meta
          name="description"
          content="Зв’яжіться з ПромЕлектроСервіс для замовлення послуг або консультації."
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
          <a href="mailto:info@promelektroservice.com">
            info@promelektroservice.com
          </a>
        </section>

        <section aria-labelledby="contact-address">
          <h2 id="contact-address">Адреса</h2>
          <p>м. Київ, вул. Прикладна, 1</p>
        </section>

        <section aria-labelledby="contact-form">
          <h2 id="contact-form">Форма зворотного зв’язку</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Ваше ім’я"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Ваш email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Ваш телефон"
              value={form.phone}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Ваше повідомлення"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Надсилання..." : "📨 Надіслати"}
            </button>
            {status === "success" && (
              <p className="success-message">✅ Дякуємо! Повідомлення надіслано.</p>
            )}
            {status === "error" && (
              <p className="error-message">❌ Помилка. Спробуйте ще раз.</p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
};

export default ContactsPage;
