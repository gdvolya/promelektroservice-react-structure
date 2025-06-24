import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  return (
    <main className="admin-panel">
      <Helmet>
        <title>Адмін-панель — Promelektroservice</title>
      </Helmet>
      <h1>Адмін-панель</h1>
      <p>Тут можна керувати контентом сайту.</p>
      {/* Сюди ти можеш додати форми, таблиці або інші адмініструючі елементи */}
    </main>
  );
};

export default AdminPanel;
