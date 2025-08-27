import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
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
        await updateDoc(docRef, { count: docSnap.data().count + 1, });
      } else {
        await updateDoc(docRef, { count: 1, });
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await addDoc(collection(db, "requests"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new",
      });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      formRef.current.reset();
    } catch (error) {
      console.error("Error sending message: ", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contacts-page">
      <Helmet>
        <title>{t('meta.contactsTitle')}</title>
        <meta name="description" content={t('meta.contactsDescription')} />
      </Helmet>

      <h1 data-aos="fade-up">{t("contacts.title")}</h1>

      <div className="contacts-content">
        <section className="contact-info" data-aos="fade-up">
          <h2 className="section-title">{t("contacts.infoTitle")}</h2>
          <div className="contact-details">
            {contacts.map((contact, index) => (
              <div key={index} className="contact-item">
                <div className="contact-icon">{contact.icon}</div>
                <div className="contact-text">
                  <h3>{contact.title}</h3>
                  {contact.details.map((detail, detailIndex) => (
                    <p key={detailIndex}>
                      {contact.link ? (
                        <a href={contact.link}>{detail}</a>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-form" data-aos="fade-up" data-aos-delay="200">
          <h2 className="section-title">{t("contacts.formTitle")}</h2>
          <form onSubmit={handleSubmit} ref={formRef}>
            <input
              type="text"
              name="name"
              placeholder={t("contacts.namePlaceholder")}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder={t("contacts.emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder={t("contacts.phonePlaceholder")}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder={t("contacts.messagePlaceholder")}
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
            <button type="submit" disabled={loading}>
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

      <section className="map-section" data-aos="fade-up" data-aos-delay="300">
        <h2 className="section-title">{t("contacts.mapTitle")}</h2>
        <div className="map-container">
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d203031.9790616149!2d30.41907937400595!3d50.48512391054366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ceb8b9816e8b%3A0xed499ed4747738f7!2sL'viv%2C%20L'viv%20Oblast%2C%20Ukraine!5e0!3m2!1sen!2sua!4v1678225586617!5m2!1sen!2sua"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
};

export default ContactsPage;