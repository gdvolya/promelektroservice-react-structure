import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/ContactsPage.css";

// Контейнер та опції для карти
const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
};

const center = {
  lat: 50.31686, // Координати Радехіва, Львівська область
  lng: 24.64695,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

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

  // Завантаження Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  // Ленивая загрузка Firebase
  useEffect(() => {
    import("../firebaseLazy")
      .then(({ db }) => {
        dbRef.current = db;
      })
      .catch((error) => {
        console.error("❌ Ошибка загрузки Firebase:", error);
      });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    const db = dbRef.current;
    if (!db) {
      console.error("❌ Firebase database не инициализирована");
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
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("❌ Ошибка при отправке заявки:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contacts-page">
      <Helmet>
        <title>{t("meta.contactsTitle")}</title>
        <meta name="description" content={t("meta.contactsDescription")} />
      </Helmet>

      <div className="container">
        <h1 data-aos="fade-up">{t("contacts.heading")}</h1>
        <p data-aos="fade-up" data-aos-delay="100">{t("contacts.description")}</p>

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
              <a href="mailto:info@promelektroservice.com">info@promelektroservice.com</a>
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

        {/* 🔹 Карта */}
        <section className="map-section" data-aos="fade-up" data-aos-delay="300">
          <h2 className="section-title">{t("contacts.mapTitle")}</h2>
          <div className="map-container">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={12}
                options={options}
              >
                <MarkerF position={center} />
              </GoogleMap>
            ) : loadError ? (
              <p className="map-error-message">
                {t("contacts.mapLoadError") || "Помилка завантаження карти."}
              </p>
            ) : (
              <div className="loading-spinner-map"></div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactsPage;