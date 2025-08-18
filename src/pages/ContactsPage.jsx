import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/ContactsPage.css";

const ContactsPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const dbRef = useRef(null);

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
    import("../firebaseLazy").then(({ db }) => {
      dbRef.current = db;
    }).catch((error) => {
      console.error("Ошибка загрузки Firebase:", error);
    });
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
    setIsSubmitting(true);
    setSubmissionStatus(null);
    
    const db = dbRef.current;
    if (!db) {
      console.error("Firebase database is not initialized.");
      setSubmissionStatus("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      await addDoc(collection(db, "submissions"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new",
      });

      setSubmissionStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Ошибка при отправке заявки в Firebase:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contacts-page">
      <Helmet>
        <title>{t("meta.contactsTitle")}</title>
        <meta
          name="description"
          content={t("meta.contactsDescription")}
        />
      </Helmet>
      
      <div className="container">
        <h1 data-aos="fade-up">{t("contacts.heading")}</h1>
        <p data-aos="fade-up" data-aos-delay="100">
          {t("contacts.description")}
        </p>
        <div className="contacts-content">
          <section className="contact-info" data-aos="fade-right" data-aos-delay="200">
            <h2 className="section-title">{t("contacts.detailsTitle")}</h2>
            <div className="info-item">
              <span className="icon">📞</span>
              <h3>{t("contacts.phoneLabel")}</h3>
              <a href="tel:+380666229776">+38 (066) 622-97-76</a>
            </div>
            <div className="info-item">
              <span className="icon">📧</span>
              <h3>Email</h3>
              <a href="mailto:info@promelektroservice.com">
                info@promelektroservice.com
              </a>
            </div>
            <div className="info-item">
              <span className="icon">📍</span>
              <h3>{t("contacts.addressLabel")}</h3>
              <p>{t("contacts.address")}</p>
            </div>
          </section>
          <section className="contact-form-section" data-aos="fade-left" data-aos-delay="200">
            <h2 className="section-title">{t("contacts.formTitle")}</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
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
              />
              <textarea
                name="message"
                placeholder={t("contacts.messagePlaceholder")}
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("contacts.sendingBtn") : t("contacts.sendBtn")}
              </button>
              {submissionStatus === "success" && (
                <p className="status-message success-message">
                  {t("contacts.successMsg")}
                </p>
              )}
              {submissionStatus === "error" && (
                <p className="status-message error-message">
                  {t("contacts.errorMsg")}
                </p>
              )}
            </form>
          </section>
        </div>
        <section className="map-section" data-aos="fade-up" data-aos-delay="300">
          <h2 className="section-title">{t("contacts.mapTitle")}</h2>
          <div className="map-container">
            <iframe
              title="Google Map Location"
              src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Radekhiv"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactsPage;