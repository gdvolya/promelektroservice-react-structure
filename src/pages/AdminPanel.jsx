import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
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
import Modal from "./Modal";

// ✅ Опции статусов с иконками и классами
const statusOptions = {
  new: { label: "🟡 Новая", className: "status-new" },
  "in-progress": { label: "🔵 В обработке", className: "status-in-progress" },
  done: { label: "✅ Выполнена", className: "status-done" },
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);

  const dbRef = useRef(null);
  const prevSortConfig = useRef(null);

  const formatFirestoreTimestamp = useCallback((timestamp) => {
    if (!timestamp || !timestamp.seconds) return "—";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("uk-UA");
  }, []);

  // 🔐 Авторизация по паролю
  const handleLogin = useCallback(() => {
    const adminPass = process.env.REACT_APP_ADMIN_PASS;

    if (!adminPass) {
      setError("⚠️ Пароль администратора не задан. Проверьте .env файл.");
      return;
    }

    if (password.trim() !== adminPass.trim()) {
      setError("Неверный пароль.");
      return;
    }

    setAuthenticated(true);
    setPassword("");
    setError("");
  }, [password]);

  const handleLogout = useCallback(() => {
    setAuthenticated(false);
    setViews(null);
    setSubmissions([]);
    dbRef.current = null;
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleLogin();
    },
    [handleLogin]
  );

  // 🔄 Загрузка данных
  useEffect(() => {
    if (!authenticated) {
      setLoading(false);
      return;
    }

    if (
      prevSortConfig.current &&
      prevSortConfig.current.key === sortConfig.key &&
      prevSortConfig.current.direction === sortConfig.direction
    ) {
      return;
    }

    setLoading(true);
    prevSortConfig.current = sortConfig;

    let unsubscribeSubmissions;
    let unsubscribeViews;

    import("../firebaseLazy")
      .then(({ db: loadedDb }) => {
        dbRef.current = loadedDb;
        const db = dbRef.current;

        // ✅ ИСПРАВЛЕНО: Сортировка поcreatedAt по умолчанию, но если
        // данных нет, можно отсортировать по имени, чтобы таблица не была пустой.
        const effectiveSortKey = sortConfig.key || "createdAt";
        const effectiveSortDirection =
          sortConfig.direction === "ascending" ? "asc" : "desc";

        const submissionsQuery = query(
          collection(db, "requests"),
          orderBy(effectiveSortKey, effectiveSortDirection)
        );

        unsubscribeSubmissions = onSnapshot(
          submissionsQuery,
          (snapshot) => {
            const fetchedSubmissions = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              // Убедимся, что createdAt всегда есть для сортировки
              createdAt: doc.data().createdAt || null,
            }));
            
            // ✅ ОТЛАДКА: Выводим данные в консоль. Проверьте её.
            console.log("Fetched submissions:", fetchedSubmissions);

            setSubmissions(fetchedSubmissions);
            setLoading(false);
            setError("");
          },
          (err) => {
            console.error("Ошибка при получении заявок:", err);
            setError("Ошибка загрузки заявок.");
            setLoading(false);
          }
        );

        const viewsDocRef = doc(db, "views", "home");
        unsubscribeViews = onSnapshot(
          viewsDocRef,
          (docSnapshot) => {
            setViews(docSnapshot.exists() ? docSnapshot.data().count : 0);
          },
          (err) => {
            console.error("Ошибка при получении просмотров:", err);
          }
        );
      })
      .catch((err) => {
        console.error("Ошибка загрузки Firebase:", err);
        setError("Ошибка инициализации базы данных.");
        setLoading(false);
      });

    return () => {
      if (unsubscribeSubmissions) unsubscribeSubmissions();
      if (unsubscribeViews) unsubscribeViews();
    };
  }, [authenticated, sortConfig]);

  // 🗑 Удаление
  const handleDelete = useCallback((id) => {
    setSubmissionToDelete(id);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    const db = dbRef.current;
    if (!db || !submissionToDelete) return;
    try {
      // ✅ ОБНОВЛЕНО: Удаляем из коллекции "requests"
      await deleteDoc(doc(db, "requests", submissionToDelete));
      setShowDeleteModal(false);
      setSubmissionToDelete(null);
    } catch (err) {
      alert("Не удалось удалить.");
      console.error(err);
    }
  }, [submissionToDelete]);

  // ✏️ Обновление статуса
  const handleUpdateStatus = useCallback(async (id, newStatus) => {
    const db = dbRef.current;
    if (!db) return;
    try {
      // ✅ ОБНОВЛЕНО: Обновляем в коллекции "requests"
      await updateDoc(doc(db, "requests", id), {
        status: newStatus,
      });
    } catch (err) {
      alert("Не удалось обновить статус.");
      console.error(err);
    }
  }, []);

  // 🔽 Сортировка
  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
    setCurrentPage(1);
  }, []);

  const getSortIcon = useCallback(
    (key) => {
      if (sortConfig.key !== key) {
        return <FaSort />;
      }
      if (sortConfig.direction === "ascending") {
        return <FaSortUp />;
      }
      return <FaSortDown />;
    },
    [sortConfig]
  );

  // 📄 Модалка с деталями
  const handleRowClick = useCallback((submission) => {
    setSubmissionDetails(submission);
    setShowDetailsModal(true);
  }, []);

  // 📤 Экспорт в Excel
  const exportToExcel = useCallback(() => {
    const dataToExport = submissions.map(({ id, createdAt, ...rest }) => ({
      ...rest,
      createdAt: formatFirestoreTimestamp(createdAt),
    }));
    const sheet = XLSX.utils.json_to_sheet(dataToExport);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Заявки");
    XLSX.writeFile(book, "submissions.xlsx");
  }, [submissions, formatFirestoreTimestamp]);

  // 🔍 Поиск
  const filteredSubmissions = submissions.filter(
    ({ name, email, phone, message }) =>
      name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📑 Пагинация
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const currentSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Экран входа ---
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

  // --- Основная панель ---
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

      {/* Панель управления */}
      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔎 Поиск по заявкам..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
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
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        {enableExport && submissions.length > 0 && (
          <button onClick={exportToExcel} className="export-btn">
            <FaDownload /> Экспортировать в Excel
          </button>
        )}
      </div>

      {/* Таблица */}
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
                      onClick={() =>
                        handleRowClick({ id, name, email, phone, message, status, createdAt })
                      }
                      title="Нажмите, чтобы прочитать полностью"
                    >
                      {message?.length > 50 ? `${message.substring(0, 50)}...` : message}
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

          {/* Пагинация */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Предыдущая
            </button>
            <span>
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Следующая
            </button>
          </div>
        </>
      )}

      {/* Модалки */}
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
            <p>
              <strong>Статус:</strong>{" "}
              <span className={`submission-status ${statusOptions[submissionDetails.status]?.className}`}>
                {statusOptions[submissionDetails.status]?.label || "—"}
              </span>
            </p>
            <p><strong>Дата:</strong> {formatFirestoreTimestamp(submissionDetails.createdAt)}</p>
            <p className="submission-message"><strong>Сообщение:</strong></p>
            <p>{submissionDetails.message}</p>
          </div>
        </Modal>
      )}

      {/* Ссылка на Lighthouse */}
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