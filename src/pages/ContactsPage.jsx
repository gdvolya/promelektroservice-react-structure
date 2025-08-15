import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
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

    try {
      const response = await fetch("https://formspree.io/f/xeogalqn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.098877665268!2d30.49089021573022!3d50.4578137794715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce56c701777d%3A0x7d6a54124e4d588a!2z0L_QtdGA0LXRgNGB0Lg!5e0!3m2!1suk!2sua!4v1628178864789!5m2!1suk!2sua"
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