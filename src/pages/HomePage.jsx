// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import backgroundImage from "../img/background.jpg";
import { db } from "../firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

function HomePage() {
  const { t } = useTranslation();
  const [views, setViews] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const updateViews = async () => {
      const ref = doc(db, "views", "home");
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          await setDoc(ref, { count: increment(1) }, { merge: true });
        } else {
          await setDoc(ref, { count: 1 });
        }
        const updatedSnap = await getDoc(ref);
        setViews(updatedSnap.data().count);
      } catch (err) {
        console.error("Counter error:", err.message);
      }
    };

    updateViews();
  }, []);

  return (
    <main
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        padding: "0",
        margin: "0"
      }}
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <Helmet>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <meta property="og:title" content={t("meta.ogTitle")} />
        <meta property="og:description" content={t("meta.ogDescription")} />
        <meta property="og:image" content="/img/background.jpg" />
        <meta property="og:url" content="https://promelektroservice.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "800px",
          marginTop: "0"
        }}
        data-aos="fade-down"
      >
        <h1 className="hero-title fancy-title" style={{ marginTop: "0" }} itemProp="name">
          {t("companyName")}
        </h1>
        <h2 className="hero-subtitle" itemProp="description">
          {t("companyDescription")}
        </h2>
        <div className="description">
          {Array.from({ length: 7 }, (_, i) => (
            <p key={i}>{t(`services.${i}`)}</p>
          ))}
        </div>
      </div>

      <div style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        fontSize: "14px",
        color: "#ccc"
      }}>
        👁 {t("views")}: {views}
      </div>
    </main>
  );
}

export default HomePage;
