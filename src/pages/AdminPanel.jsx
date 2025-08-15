import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot, // Импорт onSnapshot для реального времени
} from "firebase/firestore";
import * as XLSX from "xlsx";
import {
  FaTrash,
  FaDownload,
  FaSignInAlt,
  FaSignOutAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import "../styles/AdminPanel.css";
import Modal from "./Modal"; // Предполагается, что у вас есть компонент Modal.jsx

// Определение опций статусов с классами для стилизации
const statusOptions = {
  new: { label: "Новая", className: "status-new" },
  "in-progress": { label: "В обработке", className: "status-in-progress" },
  done: { label: "Выполнена", className: "status-done" },
};

const AdminPanel = ({ enableExport = true }) => {
  const [submissions, setSubmissions] = useState([]);
  const [views, setViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // По умолчанию 10 элементов на страницу
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);

  const dbRef = useRef(null); // Используем useRef для хранения ссылки на базу данных

  // Функция для форматирования даты
  const formatFirestoreTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "—";
    return new Date(timestamp.seconds * 1000).toLocaleString("uk-UA");
  };

  // Инициализация Firebase и подписка на данные
  useEffect(() => {
    if (!authenticated) {
      setLoading(false); // Остановить загрузку, если не аутентифицирован
      return;
    }

    setLoading(true);
    let unsubscribeSubmissions;
    let unsubscribeViews;

    // Динамический импорт Firebase
    import("../firebaseLazy")
      .then(({ db: loadedDb }) => {
        dbRef.current = loadedDb;
        const db = dbRef.current;

        // Подписка на заявки (submissions)
        const submissionsQuery = query(
          collection(db, "submissions"),
          orderBy(
            sortConfig.key,
            sortConfig.direction === "ascending" ? "asc" : "desc"
          )
        );
        unsubscribeSubmissions = onSnapshot(
          submissionsQuery,
          (snapshot) => {
            const fetchedSubmissions = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt || null,
            }));
            setSubmissions(fetchedSubmissions);
            setLoading(false);
            setError(""); // Очистить ошибку после успешной загрузки
          },
          (err) => {
            console.error("Ошибка при получении заявок:", err);
            setError("Ошибка загрузки заявок.");
            setLoading(false);
          }
        );

        // Подписка на просмотры (views)
        const viewsDocRef = doc(db, "views", "home");
        unsubscribeViews = onSnapshot(
          viewsDocRef,
          (docSnapshot) => {
            setViews(docSnapshot.exists() ? docSnapshot.data().count : 0);
          },
          (err) => {
            console.error("Ошибка при получении просмотров:", err);
            // setError("Ошибка загрузки просмотров."); // Можно добавить отдельную ошибку, но обычно не критично
          }
        );
      })
      .catch((err) => {
        console.error("Ошибка загрузки Firebase:", err);
        setError("Ошибка инициализации базы данных.");
        setLoading(false);
      });

    // Функция очистки подписок при размонтировании компонента или изменении authenticated
    return () => {
      if (unsubscribeSubmissions) unsubscribeSubmissions();
      if (unsubscribeViews) unsubscribeViews();
    };
  }, [authenticated, sortConfig]); // Перезапускать эффект при изменении authenticated или sortConfig

  const handleDelete = (id) => {
    setSubmissionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const db = dbRef.current;
    if (!db || !submissionToDelete) return;
    try {
      await deleteDoc(doc(db, "submissions", submissionToDelete));
      // setSubmissions((prev) => prev.filter((s) => s.id !== submissionToDelete)); // onSnapshot обновит сам
      setShowDeleteModal(false);
      setSubmissionToDelete(null);
    } catch (err) {
      alert("Не удалось удалить.");
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const db = dbRef.current;
    if (!db) return;
    try {
      await updateDoc(doc(db, "submissions", id), {
        status: newStatus,
      });
      // setSubmissions((prev) =>
      //   prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      // ); // onSnapshot обновит сам
    } catch (err) {
      alert("Не удалось обновить статус.");
      console.error(err);
    }
  };

  const exportToExcel = () => {
    const dataToExport = submissions.map(
      ({ id, createdAt, ...rest }) => ({
        ...rest,
        createdAt: formatFirestoreTimestamp(createdAt), // Форматируем дату для Excel
      })
    );
    const sheet = XLSX.utils.json_to_sheet(dataToExport);
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

  const handleLogout = () => {
    setAuthenticated(false);
    setViews(null);
    setSubmissions([]);
    // Дополнительная логика очистки, если требуется (например, сброс dbRef.current = null)
    dbRef.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Сбросить страницу при сортировке
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp />;
    }
    return <FaSortDown />;
  };

  const handleRowClick = (submission) => {
    setSubmissionDetails(submission);
    setShowDetailsModal(true);
  };

  const filteredSubmissions = submissions.filter(
    ({ name, email, phone, message }) =>
      name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const currentSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
        <div className="header-stats">
          {views !== null && (
            <p>
              👁 Просмотров на главной: <strong>{views}</strong>
            </p>
          )}
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Выйти
          </button>
        </div>
      </header>
      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔎 Поиск по заявкам..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Сбросить страницу при поиске
            }}
            className="search-input"
          />
        </div>
        <div className="pagination-controls">
          <label htmlFor="itemsPerPage">Заявок на странице:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Сбросить на первую страницу при изменении кол-ва элементов
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        {enableExport && submissions.length > 0 && (
          <button onClick={exportToExcel} className="export-btn">
            <FaDownload /> Экспортировать в Excel
          </button>
        )}
      </div>

      {loading && <p className="loading-spinner">⏳ Загрузка данных...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && filteredSubmissions.length === 0 ? (
        <p className="no-data">
          {searchTerm ? "Ничего не найдено по вашему запросу." : "Нет заявок."}
        </p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Имя {getSortIcon("name")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email {getSortIcon("email")}
                </th>
                <th onClick={() => handleSort("phone")}>
                  Телефон {getSortIcon("phone")}
                </th>
                <th>Сообщение</th>
                <th onClick={() => handleSort("status")}>
                  Статус {getSortIcon("status")}
                </th>
                <th onClick={() => handleSort("createdAt")}>
                  Дата {getSortIcon("createdAt")}
                </th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentSubmissions.map(
                ({ id, name, email, phone, message, status = "new", createdAt }) => (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{phone}</td>
                    <td
                      className="message-cell"
                      onClick={() => handleRowClick({ name, email, phone, message, createdAt })}
                      title="Нажмите, чтобы прочитать полностью"
                    >
                      {message?.length > 50
                        ? `${message.substring(0, 50)}...`
                        : message}
                    </td>
                    <td>
                      <select
                        value={status}
                        onChange={(e) => handleUpdateStatus(id, e.target.value)}
                        className={`status-select ${statusOptions[status]?.className}`}
                      >
                        {Object.entries(statusOptions).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{formatFirestoreTimestamp(createdAt)}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(id)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Предыдущая
            </button>
            <span>
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Следующая
            </button>
          </div>
        </>
      )}

      {showDeleteModal && (
        <Modal
          title="Подтверждение удаления"
          message="Вы действительно хотите удалить эту заявку? Это действие необратимо."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showDetailsModal && submissionDetails && (
        <Modal
          title="Детали заявки"
          onCancel={() => setShowDetailsModal(false)}
        >
          <div className="submission-details">
            <p><strong>Имя:</strong> {submissionDetails.name}</p>
            <p><strong>Email:</strong> {submissionDetails.email}</p>
            <p><strong>Телефон:</strong> {submissionDetails.phone}</p>
            <p><strong>Дата:</strong> {formatFirestoreTimestamp(submissionDetails.createdAt)}</p>
            <p className="submission-message"><strong>Сообщение:</strong></p>
            <p>{submissionDetails.message}</p>
          </div>
        </Modal>
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