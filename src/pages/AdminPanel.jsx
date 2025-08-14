import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
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
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "../styles/AdminPanel.css";
import Modal from "./Modal"; // Assuming this component exists

let db = null;
const PAGE_SIZE = 10;

// Custom hook for fetching data
const useFetchSubmissions = () => {
  const [data, setData] = useState({ submissions: [], views: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const [subsSnapshot, viewsDoc] = await Promise.all([
        getDocs(query(collection(db, "submissions"), orderBy("createdAt", "desc"))),
        getDoc(doc(db, "views", "home")),
      ]);

      const fetchedSubmissions = subsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || null,
      }));

      setData({
        submissions: fetchedSubmissions,
        views: viewsDoc.exists() ? viewsDoc.data().count : 0,
      });
      setError("");
    } catch (err) {
      console.error("Помилка завантаження даних:", err);
      setError("Помилка завантаження даних.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, error, refresh: fetchData };
};

const AdminPanel = ({ enableExport = true }) => {
  const { submissions, views, loading, error, refresh } = useFetchSubmissions();
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("authenticated") === "true"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (authenticated) {
      import("../firebaseLazy").then(({ db: loadedDb }) => {
        db = loadedDb;
        refresh();
      });
    }
  }, [authenticated, refresh]);

  const handleLogin = async () => {
    const adminPass = import.meta.env.REACT_APP_ADMIN_PASS?.trim();
    if (password.trim() === adminPass) {
      setAuthenticated(true);
      sessionStorage.setItem("authenticated", "true");
      setPassword("");
      setAuthError("");
    } else {
      setAuthError("Невірний пароль.");
    }
  };

  const confirmDelete = (submission) => {
    setSubmissionToDelete(submission);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!db || !submissionToDelete) return;
    try {
      await deleteDoc(doc(db, "submissions", submissionToDelete.id));
      refresh();
      setShowModal(false);
      setSubmissionToDelete(null);
    } catch (err) {
      alert("Не вдалося видалити.");
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (!db) return;
    const confirmed = window.confirm(
      `Ви впевнені, що хочете змінити статус заявки на "${newStatus}"?`
    );
    if (!confirmed) return;
    try {
      await updateDoc(doc(db, "submissions", id), {
        status: newStatus,
      });
      refresh();
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

  const getSortedSubmissions = () => {
    const sorted = [...submissions].sort((a, b) => {
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getSortIcon = (key) => {
    if (sortBy !== key) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

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
  
  const sortedSubmissions = getSortedSubmissions();

  const paginatedSubmissions = sortedSubmissions.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const totalPages = Math.ceil(sortedSubmissions.length / PAGE_SIZE);

  if (!authenticated) {
    return (
      <main className="admin-login">
        <Helmet>
          <title>Вхід — Адмін-панель</title>
        </Helmet>
        <h2>Вхід до адмін-панелі</h2>
        <input
          type="password"
          placeholder="Введіть пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleLogin}>
          <FaSignInAlt /> Увійти
        </button>
        {authError && <p className="error-text">{authError}</p>}
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
        <div>
          {views !== null && (
            <p>
              👁 Переглядів на головній: <strong>{views}</strong>
            </p>
          )}
        </div>
      </header>

      <div className="admin-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Пошук по заявках..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
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
      
      {!loading && sortedSubmissions.length === 0 ? (
        <p>Немає заявок, які відповідають критеріям пошуку.</p>
      ) : (
        <>
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
              {paginatedSubmissions.map(
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

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                <FaChevronLeft />
              </button>
              <span>
                Сторінка {currentPage + 1} з {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
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
          <div className="modal-actions">
            <button onClick={handleDelete} className="modal-confirm-btn">
              Видалити
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="modal-cancel-btn"
            >
              Скасувати
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default AdminPanel;