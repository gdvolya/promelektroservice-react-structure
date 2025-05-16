import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import backgroundImage from "./img/background.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { db } from "./firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

function HomePage() {
  const [views, setViews] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });

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
        position: "relative"
      }}
    >
      <Helmet>
        <title>ПромЕлектроСервіс</title>
        <meta name="description" content="Електромонтажні роботи будь-якої складності" />
      </Helmet>

      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "30px",
        borderRadius: "10px",
        maxWidth: "800px",
        marginTop: "40px"
      }}>
        <h1 className="fancy-title">ПромЕлектроСервіс</h1>
        <h2>Професійні електромонтажні роботи будь-якої складності</h2>
        <div className="description" style={{ marginTop: "20px" }}>
          <p>— Монтаж сонячних електростанцій (СЕС)</p>
          <p>— Прокладання кабельних ліній</p>
          <p>— Сборка та встановлення щитів автоматики</p>
          <p>— Введення об'єктів в експлуатацію</p>
          <p>— Ремонт електрообладнання</p>
          <p>— Обслуговування електроустановок</p>
          <p>— Електротехнічні вимірювання та протоколи</p>
        </div>
      </div>

      <div style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        fontSize: "14px",
        color: "#ccc"
      }}>
        👁 Переглядів: {views}
      </div>
    </main>
  );
}

export default HomePage;
