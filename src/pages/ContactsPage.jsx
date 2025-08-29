import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseLazy";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import "../styles/ContactsPage.css";
import AOS from "aos";
import "aos/dist/aos.css";

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
      title: t("contacts.phoneLabel"),
      details: ["+38 (097) 203 16 03", "+38 (095) 759 40 46"],
      link: "tel:+380972031603",
    },
    {
      icon: <FaEnvelope className="icon" />,
      title: "Email",
      details: ["info@promelektroservice.com"],
      link: "mailto:info@promelektroservice.com",
    },
    {
      icon: <FaMapMarkerAlt className="icon" />,
      title: t("contacts.addressLabel"),
      details: [t("contacts.address")],
    },
  ];

  const incrementViewCount = async () => {
    try {
      const docRef = doc(db, "views", "home");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          count: (docSnap.data().count || 0) + 1,
        });
      } else {
        await setDoc(docRef, {
          count: 1,
        });
      }
    } catch (e) {
      console.error("Error updating view count: ", e);
    }
  };

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
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
        <title>{t("meta.contactsTitle")}</title>
        <meta name="description" content={t("meta.contactsDescription")} />
        <meta name="keywords" content={t("contactsPage.metaKeywords")} />
      </Helmet>

      <div className="contacts-page">
        <h1 data-aos="fade-up">{t("contacts.heading")}</h1>
        <p data-aos="fade-up" data-aos-delay="100">
          {t("contacts.description")}
        </p>

        <div className="contacts-content">
          {/* Инфо */}
          <section
            className="contact-info"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <h2 className="section-title">{t("contacts.detailsTitle")}</h2>
            {contacts.map((item, index) => (
              <div key={index} className="info-item">
                <span className="icon">{item.icon}</span>
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

          {/* Форма */}
          <section
            className="contact-form-section"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <h2 className="section-title">{t("contacts.formTitle")}</h2>
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <label htmlFor="name" className="visually-hidden">
                {t("contacts.namePlaceholder")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                aria-label={t("contacts.namePlaceholder")}
                placeholder={t("contacts.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />

              <label htmlFor="email" className="visually-hidden">
                {t("contacts.emailPlaceholder")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                aria-label={t("contacts.emailPlaceholder")}
                placeholder={t("contacts.emailPlaceholder")}
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />

              <label htmlFor="phone" className="visually-hidden">
                {t("contacts.phonePlaceholder")}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                aria-label={t("contacts.phonePlaceholder")}
                placeholder={t("contacts.phonePlaceholder")}
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
              />

              <label htmlFor="message" className="visually-hidden">
                {t("contacts.messagePlaceholder")}
              </label>
              <textarea
                id="message"
                name="message"
                aria-label={t("contacts.messagePlaceholder")}
                placeholder={t("contacts.messagePlaceholder")}
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                autoComplete="off"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                aria-label={t("contacts.sendBtn")}
              >
                {loading ? <FaSpinner className="spinner" /> : t("contacts.sendBtn")}
              </button>
            </form>

            {status === "success" && (
              <p className="status-message success-message">
                {t("contacts.successMsg")}
              </p>
            )}
            {status === "error" && (
              <p className="status-message error-message">
                {t("contacts.errorMsg")}
              </p>
            )}
          </section>
        </div>

        {/* Карта */}
        <section
          className="map-section"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h2 className="section-title">{t("contacts.mapTitle")}</h2>
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
