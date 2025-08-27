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
    // ⚠️ ВАЖНО: Хранение пароля в .env-файле и доступ к нему
    // через process.env.REACT_APP_ADMIN_PASS не безопасно.
    // Этот метод не подходит для публичных сайтов, так как
    // переменные окружения, начинающиеся с REACT_APP_,
    // встраиваются в скомпилированный код. Рекомендуется
    // использовать более безопасный метод, например, аутентификацию
    // через Firebase Authentication.
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
        const effectiveSortDirection = sortConfig.direction === "ascending" ? "asc" : "desc";
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
        setError("Ошибка загрузки Firebase. Убедитесь, что конфигурация верна.");
        setLoading(false);
      });

    return () => {
      if (unsubscribeSubmissions) unsubscribeSubmissions();
      if (unsubscribeViews) unsubscribeViews();
    };
  }, [authenticated, sortConfig]);

  // 🗑️ Удаление заявки
  const handleDelete = (submission) => {
    setSubmissionToDelete(submission);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!submissionToDelete) return;
    try {
      await deleteDoc(doc(dbRef.current, "requests", submissionToDelete.id));
    } catch (e) {
      console.error("Ошибка при удалении заявки:", e);
      setError("Ошибка при удалении заявки.");
    } finally {
      setShowDeleteModal(false);
      setSubmissionToDelete(null);
    }
  };

  // ✍️ Обновление статуса
  const handleStatusChange = useCallback(async (id, newStatus) => {
    try {
      const docRef = doc(dbRef.current, "requests", id);
      await updateDoc(docRef, { status: newStatus });
    } catch (e) {
      console.error("Ошибка при обновлении статуса:", e);
      setError("Ошибка при обновлении статуса.");
    }
  }, []);

  // 📊 Экспорт данных
  const handleExport = useCallback(() => {
    const data = submissions.map((sub) => ({
      Имя: sub.name,
      Email: sub.email,
      Телефон: sub.phone,
      Сообщение: sub.message,
      Статус: statusOptions[sub.status]?.label,
      Дата: formatFirestoreTimestamp(sub.createdAt),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Заявки");
    XLSX.writeFile(wb, "заявки.xlsx");
  }, [submissions, formatFirestoreTimestamp]);

  // 🔍 Поиск
  const filteredSubmissions = useMemo(() => {
    if (!searchTerm) {
      return submissions;
    }
    return submissions.filter(
      (sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [submissions, searchTerm]);

  // 🗂️ Сортировка
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // 📄 Пагинация
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubmissions, currentPage, itemsPerPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
  };

  if (!authenticated) {
    return (
      <main className="admin-panel login-form-container">
        <Helmet>
          <title>Admin Panel - Login</title>
        </Helmet>
        <h2>Admin Panel Login</h2>
        <div className="login-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter password"
          />
          <button onClick={handleLogin}>
            <FaSignInAlt /> Войти
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="admin-panel">
      <Helmet>
        <title>Admin Panel</title>
      </Helmet>
      <div className="admin-header">
        <h1>Панель администратора</h1>
        <div className="header-controls">
          <div className="views-counter">
            <p>Просмотров сайта: {views}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Выйти
          </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {loading && <div className="loading-spinner">Загрузка данных...</div>}

      {!loading && (
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Поиск по заявкам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {enableExport && (
            <button onClick={handleExport} className="export-btn">
              <FaDownload /> Экспорт в Excel
            </button>
          )}
        </div>
      )}

      {!loading && filteredSubmissions.length > 0 && (
        <>
          <table className="submissions-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("name")}>
                  Имя <button className="sort-btn">{renderSortIcon("name")}</button>
                </th>
                <th onClick={() => requestSort("email")}>
                  Email <button className="sort-btn">{renderSortIcon("email")}</button>
                </th>
                <th onClick={() => requestSort("phone")}>
                  Телефон <button className="sort-btn">{renderSortIcon("phone")}</button>
                </th>
                <th onClick={() => requestSort("status")}>
                  Статус <button className="sort-btn">{renderSortIcon("status")}</button>
                </th>
                <th onClick={() => requestSort("createdAt")}>
                  Дата <button className="sort-btn">{renderSortIcon("createdAt")}</button>
                </th>
                <th>Сообщение</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.map((submission) => (
                <tr key={submission.id} className="submission-row">
                  <td>{submission.name || "—"}</td>
                  <td>{submission.email || "—"}</td>
                  <td>{submission.phone || "—"}</td>
                  <td>
                    <select
                      value={submission.status}
                      onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                      className={`status-select ${statusOptions[submission.status]?.className}`}
                    >
                      {Object.keys(statusOptions).map((statusKey) => (
                        <option key={statusKey} value={statusKey}>
                          {statusOptions[statusKey].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{formatFirestoreTimestamp(submission.createdAt)}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => {
                        setSubmissionDetails(submission);
                        setShowDetailsModal(true);
                      }}
                    >
                      Посмотреть
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(submission)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={goToPrevPage} disabled={currentPage === 1}>
              Назад
            </button>
            <span>
              Страница {currentPage} из {totalPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Вперед
            </button>
          </div>
        </>
      )}

      {showDeleteModal && (
        <Modal
          title="Подтверждение удаления"
          message="Вы уверены, что хотите удалить эту заявку? Это действие необратимо."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showDetailsModal && submissionDetails && (
        <Modal
          title="Детали заявки"
          onClose={() => setShowDetailsModal(false)}
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