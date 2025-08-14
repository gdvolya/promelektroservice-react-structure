import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import {
  FaTrash,
  FaDownload,
  FaSearch,
  FaSignInAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import "../styles/AdminPanel.css";
import Modal from "./Modal";

let db = null;

const AdminPanel = ({ enableExport = true }) => {
  const [submissions, setSubmissions] = useState([]);
  const [views, setViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("authenticated") === "true"
  );
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchData = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const [subsSnapshot, viewsDoc] = await Promise.all([
        getDocs(collection(db, "submissions")),
        getDoc(doc(db, "views", "home")),
      ]);
      const fetchedSubmissions = subsSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || null,
      }));
      setSubmissions(fetchedSubmissions);
      setViews(viewsDoc.exists() ? viewsDoc.data().count : 0);
    } catch (err) {
      console.error("Помилка завантаження даних:", err);
      setError("Помилка завантаження даних.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      import("../firebaseLazy").then(({ db: loadedDb }) => {
        db = loadedDb;
        fetchData();
      });
    }
  }, [authenticated, fetchData]);

  const handleLogin = () => {
    const adminPass = import.meta.env.REACT_APP_ADMIN_PASS?.trim();
    if (password.trim() === adminPass) {
      setAuthenticated(true);
      sessionStorage.setItem("authenticated", "true");
      setPassword("");
      setError("");
    } else {
      setError("Невірний пароль.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const confirmDelete = (submission) => {
    setSubmissionToDelete(submission);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!db || !submissionToDelete) return;
    try {
      await deleteDoc(doc(db, "submissions", submissionToDelete.id));
      setSubmissions((prev) =>
        prev.filter((s) => s.id !== submissionToDelete.id)
      );
      setShowModal(false);
      setSubmissionToDelete(null);
    } catch (err) {
      alert("Не вдалося видалити.");
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "submissions", id), {
        status: newStatus,
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      console.error("Помилка оновлення статусу:", err);
    }
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (key) => {
    if (sortBy !== key) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const filteredSubmissions = submissions.filter(
    ({ name, email, phone, message }) =>
      name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortedSubmissions = () => {
    if (!sortBy) return filteredSubmissions;
    return [...filteredSubmissions].sort((a, b) => {
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedSubmissions = getSortedSubmissions();

  const exportToExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(
      submissions.map(({ id, createdAt, ...rest }) => ({
        ...rest,
        Дата: createdAt ? createdAt.toLocaleString("uk-UA") : "—",
      }))
    );
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Заявки");
    XLSX.writeFile(book, "submissions.xlsx");
  };

  if (!authenticated) {
    return (
      <main className="admin-login">
        <Helmet>
          <title>Вхід в адмін-панель</title>
        </Helmet>
        <div className="login-box">
          <h2>
            <FaSignInAlt /> Вхід в адмін-панель
          </h2>
          <input
            type="password"
            placeholder="Введіть пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleLogin}>Увійти</button>
          {error && <p className="error-text">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="admin-panel">
      <Helmet>
        <title>Адмін-панель — ПромЕлектроСервіс</title>
      </Helmet>
      <header className="admin-header">
        <h1>📋 Адмін-панель</h1>
        {views !== null && (
          <p>
            👁 Переглядів на головній: <strong>{views}</strong>
          </p>
        )}
      </header>

      <div className="admin-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Пошук по заявках..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {enableExport && submissions.length > 0 && (
          <button onClick={exportToExcel} className="export-btn">
            <FaDownload /> Експортувати в Excel
          </button>
        )}
      </div>

      {loading && <p>⏳ Завантаження даних...</p>}
      {error && <p className="error-text">❌ {error}</p>}

      {sortedSubmissions.length === 0 && !loading ? (
        <p>Немає заявок, які відповідають критеріям пошуку.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Ім’я {getSortIcon("name")}
              </th>
              <th onClick={() => handleSort("email")}>
                Email {getSortIcon("email")}
              </th>
              <th onClick={() => handleSort("phone")}>
                Телефон {getSortIcon("phone")}
              </th>
              <th>Повідомлення</th>
              <th onClick={() => handleSort("createdAt")}>
                Дата {getSortIcon("createdAt")}
              </th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubmissions.map(
              ({ id, name, email, phone, message, createdAt, status }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{phone}</td>
                  <td>
                    <div className="message-cell">{message}</div>
                  </td>
                  <td>
                    {createdAt
                      ? new Date(createdAt).toLocaleString("uk-UA")
                      : "—"}
                  </td>
                  <td>
                    <select
                      value={status || "New"}
                      onChange={(e) => handleUpdateStatus(id, e.target.value)}
                    >
                      <option value="New">Нова</option>
                      <option value="In Progress">В роботі</option>
                      <option value="Completed">Завершено</option>
                      <option value="Canceled">Скасовано</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => confirmDelete({ id, name })}
                      className="delete-btn"
                    >
                      <FaTrash /> Видалити
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <Modal
          title="Підтвердження видалення"
          onClose={() => setShowModal(false)}
        >
          <p>
            Ви впевнені, що хочете видалити заявку від{" "}
            <strong>{submissionToDelete?.name}</strong>?
          </p>
          <button onClick={handleDelete} className="modal-confirm-btn">
            Видалити
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="modal-cancel-btn"
          >
            Скасувати
          </button>
        </Modal>
      )}
    </main>
  );
};

export default AdminPanel;
