import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import backgroundImage from "../img/background.webp"; // ✅ импорт из src
import "../css/HomePage.css";

function HomePage() {
  const { t } = useTranslation();
  const [views, setViews] = useState(0);

  useEffect(() => {
    const updateViews = async () => {
      try {
        const ref = doc(db, "views", "home");
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

    if ("requestIdleCallback" in window) {
      requestIdleCallback(updateViews, { timeout: 6000 });
    } else {
      setTimeout(updateViews, 6000);
    }
  }, []);

  return (
    <main
      className="hero-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <Helmet>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <meta property="og:title" content={t("meta.ogTitle")} />
        <meta property="og:description" content={t("meta.ogDescription")} />
        <meta property="og:image" content="/img/background.webp" />
        <meta property="og:url" content="https://promelektroservice.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" as="image" href="/img/background.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
      </Helmet>

      <div className="hero-content">
        <h1 className="hero-title fancy-title" itemProp="name">
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

      <div className="views-counter">👁 {t("views")}: {views}</div>
    </main>
  );
}

export default HomePage;
