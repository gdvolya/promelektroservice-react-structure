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
      details: ["г. Киев"],
      link: "https://www.google.com/maps/place/Киев/@50.401699,30.252511,10z",
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
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
      const formSubmissionRef = doc(db, "formSubmissions", "submissionCount");
      const docSnap = await getDoc(formSubmissionRef);

      let newCount = 1;
      if (docSnap.exists()) {
        const currentCount = docSnap.data().count;
        newCount = currentCount + 1;
        await updateDoc(formSubmissionRef, { count: newCount });
      } else {
        await setDoc(formSubmissionRef, { count: newCount });
      }

      const submissionData = {
        ...formData,
        timestamp: serverTimestamp(),
        submissionNumber: newCount,
      };

      await addDoc(collection(db, "submissions"), submissionData);

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setStatus("success");
    } catch (error) {
      console.error("Error submitting form: ", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contacts-page">
      <Helmet>
        <title>{t("seo.contactsTitle")}</title>
        <meta name="description" content={t("seo.contactsDescription")} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="site-content-wrapper">
        <main>
          <section className="contacts-info-section">
            <h1 className="section-title" data-aos="fade-up">
              {t("contacts.pageTitle")}
            </h1>
            <p className="section-description" data-aos="fade-up" data-aos-delay="100">
              {t("contacts.pageDescription")}
            </p>
            <div className="contacts-list">
              {contacts.map((contact, index) => (
                <div
                  className="contact-card"
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={150 + index * 100}
                >
                  <div className="icon-wrapper">{contact.icon}</div>
                  <h3>{contact.title}</h3>
                  {contact.details.map((detail, i) => (
                    <a href={contact.link} key={i}>
                      <p>{detail}</p>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="contact-form-section" data-aos="fade-up">
            <h2 className="section-title">{t("contacts.formTitle")}</h2>
            <p className="section-description">
              {t("contacts.formDescription")}
            </p>
            <div className="contact-form-wrapper">
              <form ref={formRef} onSubmit={handleSubmit} className="contact-form" name="contactForm">
                <label htmlFor="name">{t("contacts.nameLabel")}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("contacts.nameLabel")}
                  required
                  autoComplete="name"
                />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  autoComplete="email"
                />
                <label htmlFor="phone">{t("contacts.phoneLabel")}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("contacts.phoneLabel")}
                  required
                  autoComplete="tel"
                />
                <label htmlFor="message">{t("contacts.messageLabel")}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("contacts.messageLabel")}
                  required
                  autoComplete="off"
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
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ContactsPage;