import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseLazy";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import "../styles/ContactsPage.css";

const ContactsPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const contacts = [
    {
      icon: <FaPhone className="icon" />,
      title: t("contact.phoneTitle"),
      details: ["+38 (097) 203 16 03", "+38 (095) 759 40 46"],
      link: "tel:+380972031603",
    },
    {
      icon: <FaEnvelope className="icon" />,
      title: t("contact.emailTitle"),
      details: ["info@promelektroservice.com"],
      link: "mailto:info@promelektroservice.com",
    },
    {
      icon: <FaMapMarkerAlt className="icon" />,
      title: t("contact.addressTitle"),
      details: ["Україна, м. Київ"],
    },
  ];

  const incrementViewCount = async () => {
    try {
      const docRef = doc(db, "views", "home");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          count: docSnap.data().count + 1,
        });
      } else {
        await updateDoc(docRef, {
          count: 1,
        });
      }
    } catch (e) {
      console.error("Error updating view count: ", e);
    }
  };

  useEffect(() => {
    incrementViewCount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ ИСПРАВЛЕНО: Добавляем поле createdAt с меткой времени сервера.
      await addDoc(collection(db, "requests"), {
        ...formData,
        status: "new",
        createdAt: serverTimestamp(),
      });

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("contactsPage.metaTitle")}</title>
        <meta
          name="description"
          content={t("contactsPage.metaDescription")}
        />
        <meta
          name="keywords"
          content={t("contactsPage.metaKeywords")}
        />
      </Helmet>

      <div className="contacts-page">
        <h1>{t("contactsPage.title")}</h1>
        <p>{t("contactsPage.subtitle")}</p>

        <div className="contacts-content">
          <section className="contact-info">
            <h2 className="section-title">{t("contact.infoTitle")}</h2>
            {contacts.map((item, index) => (
              <div key={index} className="info-item">
                {item.icon}
                <h3>{item.title}</h3>
                {item.details.map((detail, i) =>
                  item.link ? (
                    <a key={i} href={item.link}>
                      {detail}
                    </a>
                  ) : (
                    <p key={i}>{detail}</p>
                  )
                )}
              </div>
            ))}
          </section>

          <section className="contact-form-section">
            <h2 className="section-title">{t("contact.formTitle")}</h2>
            <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
              <input
                type="text"
                name="name"
                placeholder={t("form.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder={t("form.emailPlaceholder")}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder={t("form.phonePlaceholder")}
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder={t("form.messagePlaceholder")}
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
              <button type="submit" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : t("form.sendButton")}
              </button>
            </form>
            {status === "success" && (
              <p className="status-message success-message">
                {t("form.successMessage")}
              </p>
            )}
            {status === "error" && (
              <p className="status-message error-message">
                {t("form.errorMessage")}
              </p>
            )}
          </section>
        </div>

        <section className="map-section">
          <h2 className="section-title">{t("contact.locationTitle")}</h2>
          <div className="map-container">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20309.845422830846!2d30.51866384288005!3d50.45012351239859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce256e297123%3A0xed4d59a59c727a8d!2z0LzQtdGA0YPRgdC60LDRjyDRg9C70L7QstC-0YDQvdC-0Lkg0L_QviDQmtGA0L7Qv9C-0YDQsCDQmtGA0L7RgdC60Lgg0JzQtdGA0L7QvNC10YI!5e0!3m2!1sru!2sua!4v1628178129590!5m2!1sru!2sua"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactsPage;