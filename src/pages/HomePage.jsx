// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import backgroundImage from "../img/background.webp"; // заменено на .webp
import { db } from "../firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

function HomePage() {
  const { t } = useTranslation();
  const [views, setViews] = useState(0);

  useEffect(() => {
    // 🔄 Отложенное обновление просмотров
    const timer = setTimeout(() => {
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

      updateViews();
    }, 4000); // отложено на 4 секунды

    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        margin: "0",
        overflow: "hidden"
      }}
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
      </Helmet>

      {/* ✅ Оптимизированное изображение */}
      <img
        src={backgroundImage}
        alt="Фонове зображення"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1
        }}
        loading="eager"
        fetchpriority="high"
        width="1920"
        height="1080"
      />

      <div style={{ padding: "40px 20px", maxWidth: "800px" }}>
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
