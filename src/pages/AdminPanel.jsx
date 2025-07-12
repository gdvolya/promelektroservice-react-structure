import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import "../styles/AdminPanel.css";

let db = null;

const AdminPanel = ({ enableExport = true }) => {
  const [submissions, setSubmissions] = useState([]);
  const [views, setViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const [subsSnapshot, viewsDoc] = await Promise.all([
        getDocs(collection(db, "submissions")),
        getDoc(doc(db, "views", "home")),
      ]);
      setSubmissions(
        subsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || null,
        }))
      );
      setViews(viewsDoc.exists() ? viewsDoc.data().count : 0);
    } catch (err) {
      console.error("Помилка завантаження даних:", err);
      setError("Помилка завантаження даних.");
    } finally {
      setLoading(false);
    }
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
    const rawPass =
      import.meta.env?.REACT_APP_ADMIN_PASS || process.env.REACT_APP_ADMIN_PASS;

    if (typeof rawPass === "undefined") {
      console.warn("⛔ REACT_APP_ADMIN_PASS is undefined. Check .env.local or Vercel variables.");
      setError("⚠️ Пароль адміністратора не заданий у .env.local або середовищі.");
      return;
    }

    const adminPass = rawPass.trim();

    if (!adminPass) {
      console.warn("⚠️ REACT_APP_ADMIN_PASS існує, але порожній.");
      setError("⚠️ Пароль адміністратора заданий як порожній рядок.");
      return;
    }

    if (import.meta.env?.MODE === "development") {
      console.log("[DEBUG] Пароль з env:", adminPass);
    }

    if (password.trim() !== adminPass) {
      setError("Невірний пароль.");
      return;
    }

    setTimeout(() => {
      setAuthenticated(true);
      setPassword("");
      setError("");
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const filteredSubmissions = submissions.filter(
    ({ name, email, phone, message }) =>
      name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Отправка данных формы в Firestore
  const handleFormSubmit = async (formData) => {
    if (!db) return;
    try {
      await addDoc(collection(db, "submissions"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      fetchData();  // Обновление данных на странице админ панели
    } catch (err) {
      console.error("Помилка надсилання форми:", err);
    }
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
          placeholder="Введіть пароль адміністратора"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button onClick={handleLogin} disabled={!password.trim()}>
          🔓 Увійти
        </button>
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
        <p>
          👁 Переглядів на головній: <strong>{views}</strong>
        </p>
      )}
      <input
        type="text"
        placeholder="🔎 Пошук по заявках..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {filteredSubmissions.length === 0 && !loading ? (
        <p>Немає заявок.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ім’я</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Повідомлення</th>
              <th>Дата</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(
              ({ id, name, email, phone, message, createdAt }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{phone}</td>
                  <td>{message}</td>
                  <td>
                    {createdAt?.seconds
                      ? new Date(createdAt.seconds * 1000).toLocaleString("uk-UA")
                      : "—"}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(id)}>🗑 Видалити</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
      {enableExport && submissions.length > 0 && (
        <button onClick={exportToExcel} className="export-btn">
          ⬇️ Експортувати в Excel
        </button>
      )}
      <div style={{ marginTop: "2rem" }}>
        <a
          href="/report/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="report-link"
        >
          📊 Переглянути Lighthouse звіти
        </a>
      </div>
    </main>
  );
};

export default AdminPanel;
