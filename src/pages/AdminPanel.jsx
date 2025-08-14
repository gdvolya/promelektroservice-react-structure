import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { FaTrash, FaDownload, FaSearch, FaSignInAlt } from "react-icons/fa";
import "../styles/AdminPanel.css";

const AdminPanel = ({ enableExport = true }) => {
  const [submissions, setSubmissions] = useState([]);
  const [views, setViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dbRef = useRef(null);

  const fetchData = useCallback(async () => {
    const db = dbRef.current;
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
      console.error("Ошибка загрузки данных:", err);
      setError("Ошибка загрузки данных.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated && !dbRef.current) {
      import("../firebaseLazy").then(({ db: loadedDb }) => {
        dbRef.current = loadedDb;
        fetchData();
      });
    } else if (authenticated && dbRef.current) {
      fetchData();
    }
  }, [authenticated, fetchData]);

  const handleDelete = async (id) => {
    const db = dbRef.current;
    if (!db) return;
    const confirmed = window.confirm("Вы уверены, что хотите удалить?");
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, "submissions", id));
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Не удалось удалить.");
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
    const adminPass = process.env.REACT_APP_ADMIN_PASS;

    if (!adminPass) {
      setError("⚠️ Пароль администратора не задан в .env.local или среде.");
      return;
    }

    if (password.trim() !== adminPass.trim()) {
      setError("Неверный пароль.");
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

  if (!authenticated) {
    return (
      <main className="admin-login">
        <Helmet>
          <title>Вход в админ-панель — ПромЕлектроСервіс</title>
        </Helmet>
        <h2>🔐 Вход в админ-панель</h2>
        <input
          type="password"
          placeholder="Введите пароль администратора"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button onClick={handleLogin} disabled={!password.trim()}>
          <FaSignInAlt /> Войти
        </button>
        {error && <p className="error-text">{error}</p>}
      </main>
    );
  }

  return (
    <main className="admin-panel">
      <Helmet>
        <title>Админ-панель — ПромЕлектроСервіс</title>
      </Helmet>
      <header className="admin-header">
        <h1>📋 Админ-панель</h1>
        <div>
          {views !== null && (
            <p>
              👁 Просмотров на главной: <strong>{views}</strong>
            </p>
          )}
        </div>
      </header>
      <div className="admin-controls">
        <input
          type="text"
          placeholder="🔎 Поиск по заявкам..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {enableExport && submissions.length > 0 && (
          <button onClick={exportToExcel} className="export-btn">
            <FaDownload /> Экспортировать в Excel
          </button>
        )}
      </div>

      {loading && <p>⏳ Загрузка данных...</p>}
      {error && <p className="error-text">{error}</p>}

      {filteredSubmissions.length === 0 && !loading ? (
        <p>Нет заявок.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Сообщение</th>
              <th>Дата</th>
              <th>Действия</th>
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
                    <button
                      onClick={() => handleDelete(id)}
                      className="delete-btn"
                    >
                      <FaTrash /> Удалить
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      <div className="extra-links">
        <a
          href="/report/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="report-link"
        >
          📊 Просмотреть Lighthouse отчеты
        </a>
      </div>
    </main>
  );
};

export default AdminPanel;