import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import "../css/AdminPanel.css";

let db = null;

const AdminPanel = ({ enableExport = true }) => {
  const [submissions, setSubmissions] = useState([]);
  const [views, setViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const [subsSnapshot, viewsDoc] = await Promise.all([
        getDocs(collection(db, "submissions")),
        getDoc(doc(db, "views", "home")),
      ]);
      setSubmissions(
        subsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setViews(viewsDoc.exists() ? viewsDoc.data().count : 0);
    } catch (err) {
      console.error("Error loading data:", err.message);
      setError("Помилка завантаження даних.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated && !db) {
      import("../firebaseLazy").then(({ db: loadedDb }) => {
        db = loadedDb;
        fetchData();
      });
    } else if (authenticated && db) {
      fetchData();
    }
  }, [authenticated, fetchData]);

  const handleDelete = async (id) => {
    if (!db) return;
    const confirmed = window.confirm("Ви впевнені, що хочете видалити?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "submissions", id));
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Не вдалося видалити.");
      console.error(err);
    }
  };

  const exportToExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(
      submissions.map(({ id, ...rest }) => rest)
    );
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Заявки");
    XLSX.writeFile(book, "submissions.xlsx");
  };

  const handleLogin = () => {
    const isAuth = password === import.meta.env.VITE_ADMIN_PASS;
    if (!isAuth) {
      setError("Невірний пароль.");
      return;
    }
    setAuthenticated(true);
    setPassword("");
    setError("");
  };

  if (!authenticated) {
    return (
      <main className="admin-login">
        <Helmet>
          <title>Вхід в адмін-панель — ПромЕлектроСервіс</title>
        </Helmet>
        <h2>🔐 Вхід до адмін-панелі</h2>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Увійти</button>
        {error && <p className="error-text">{error}</p>}
      </main>
    );
  }

  return (
    <main className="admin-panel">
      <Helmet>
        <title>Адмін-панель — ПромЕлектроСервіс</title>
      </Helmet>
      <h1>Адмін-панель</h1>
      {loading && <p>⏳ Завантаження даних...</p>}
      {error && <p className="error-text">{error}</p>}
      {views !== null && (
        <p>👁 Переглядів на головній: <strong>{views}</strong></p>
      )}
      {submissions.length === 0 && !loading ? (
        <p>Немає заявок.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ім’я</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Повідомлення</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(({ id, name, email, phone, message }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{email}</td>
                <td>{phone}</td>
                <td>{message}</td>
                <td>
                  <button onClick={() => handleDelete(id)}>🗑 Видалити</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {enableExport && submissions.length > 0 && (
        <button onClick={exportToExcel} className="export-btn">
          ⬇️ Експортувати в Excel
        </button>
      )}
    </main>
  );
};

export default AdminPanel;
