import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  FaTrash,
  FaSignInAlt,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // форма добавления
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    description: "",
    imageUrl: "",
    extraImages: [],
  });

  // редактирование
  const [editMode, setEditMode] = useState(null);
  const [editPortfolio, setEditPortfolio] = useState(null);

  const dbRef = useRef(null);

  const handleLogin = () => {
    const adminPass = process.env.REACT_APP_ADMIN_PASS;
    if (!adminPass) {
      alert("Пароль администратора не задан в .env");
      return;
    }
    if (password.trim() === adminPass.trim()) {
      setAuthenticated(true);
    } else {
      alert("Неверный пароль");
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    let unsubPortfolio;

    import("../firebaseLazy").then(({ db }) => {
      dbRef.current = db;
      unsubPortfolio = onSnapshot(collection(db, "portfolio"), (snap) => {
        setPortfolio(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    });

    return () => unsubPortfolio && unsubPortfolio();
  }, [authenticated]);

  const handleAddPortfolio = async () => {
    if (!dbRef.current) return;
    if (!newPortfolio.title || !newPortfolio.imageUrl) {
      alert("Заполните название и главное фото!");
      return;
    }
    await addDoc(collection(dbRef.current, "portfolio"), {
      ...newPortfolio,
      createdAt: new Date(),
    });
    setNewPortfolio({ title: "", description: "", imageUrl: "", extraImages: [] });
  };

  const handleDeletePortfolio = async (id) => {
    if (!dbRef.current) return;
    if (window.confirm("Удалить проект?")) {
      await deleteDoc(doc(dbRef.current, "portfolio", id));
    }
  };

  const handleEditPortfolio = (work) => {
    setEditMode(work.id);
    setEditPortfolio({ ...work });
  };

  const handleSaveEdit = async () => {
    if (!dbRef.current || !editPortfolio) return;
    await updateDoc(doc(dbRef.current, "portfolio", editMode), {
      ...editPortfolio,
    });
    setEditMode(null);
    setEditPortfolio(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditPortfolio(null);
  };

  const handleAddExtraImage = (isEdit = false) => {
    if (isEdit) {
      setEditPortfolio((prev) => ({
        ...prev,
        extraImages: [...(prev.extraImages || []), ""],
      }));
    } else {
      setNewPortfolio((prev) => ({
        ...prev,
        extraImages: [...prev.extraImages, ""],
      }));
    }
  };

  const handleExtraImageChange = (index, value, isEdit = false) => {
    if (isEdit) {
      setEditPortfolio((prev) => {
        const updated = [...(prev.extraImages || [])];
        updated[index] = value;
        return { ...prev, extraImages: updated };
      });
    } else {
      setNewPortfolio((prev) => {
        const updated = [...prev.extraImages];
        updated[index] = value;
        return { ...prev, extraImages: updated };
      });
    }
  };

  if (!authenticated) {
    return (
      <main className="admin-login">
        <Helmet>
          <title>Вход в админ-панель</title>
        </Helmet>
        <h2>🔐 Вход</h2>
        <input
          type="password"
          placeholder="Пароль администратора"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button onClick={handleLogin}>
          <FaSignInAlt /> Войти
        </button>
      </main>
    );
  }

  return (
    <main className="admin-panel">
      <Helmet>
        <title>Админ-панель — Портфолио</title>
      </Helmet>

      <header className="admin-header">
        <h1>🖼 Управление портфолио</h1>
        <button onClick={() => setAuthenticated(false)}>
          <FaSignOutAlt /> Выйти
        </button>
      </header>

      {/* Добавление проекта */}
      <section className="portfolio-form">
        <h2>➕ Добавить проект</h2>
        <input
          type="text"
          placeholder="Название проекта"
          value={newPortfolio.title}
          onChange={(e) =>
            setNewPortfolio((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <textarea
          placeholder="Описание"
          value={newPortfolio.description}
          onChange={(e) =>
            setNewPortfolio((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Главное фото (URL)"
          value={newPortfolio.imageUrl}
          onChange={(e) =>
            setNewPortfolio((prev) => ({ ...prev, imageUrl: e.target.value }))
          }
        />
        {newPortfolio.extraImages.map((img, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Доп. фото ${i + 1}`}
            value={img}
            onChange={(e) => handleExtraImageChange(i, e.target.value)}
          />
        ))}
        <button onClick={() => handleAddExtraImage(false)}>
          <FaPlus /> Доп. фото
        </button>
        <button className="add-btn" onClick={handleAddPortfolio}>
          ➕ Сохранить проект
        </button>
      </section>

      {/* Список проектов */}
      <section className="portfolio-list">
        <h2>📋 Список проектов</h2>
        {portfolio.length === 0 ? (
          <p>Нет добавленных проектов</p>
        ) : (
          portfolio.map((work) =>
            editMode === work.id ? (
              <div key={work.id} className="portfolio-item editing">
                <input
                  type="text"
                  value={editPortfolio.title}
                  onChange={(e) =>
                    setEditPortfolio((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <textarea
                  value={editPortfolio.description}
                  onChange={(e) =>
                    setEditPortfolio((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  value={editPortfolio.imageUrl}
                  onChange={(e) =>
                    setEditPortfolio((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                />
                {editPortfolio.extraImages?.map((img, i) => (
                  <input
                    key={i}
                    type="text"
                    value={img}
                    onChange={(e) =>
                      handleExtraImageChange(i, e.target.value, true)
                    }
                  />
                ))}
                <button onClick={() => handleAddExtraImage(true)}>
                  <FaPlus /> Фото
                </button>
                <button onClick={handleSaveEdit}>
                  <FaSave /> Сохранить
                </button>
                <button onClick={handleCancelEdit}>
                  <FaTimes /> Отмена
                </button>
              </div>
            ) : (
              <div key={work.id} className="portfolio-item">
                <h3>{work.title}</h3>
                <img src={work.imageUrl} alt={work.title} />
                <p>{work.description}</p>
                {work.extraImages?.length > 0 && (
                  <div className="extra-imgs">
                    {work.extraImages.map((img, i) => (
                      <img key={i} src={img} alt={`extra-${i}`} />
                    ))}
                  </div>
                )}
                <button onClick={() => handleEditPortfolio(work)}>
                  <FaEdit /> Редактировать
                </button>
                <button onClick={() => handleDeletePortfolio(work.id)}>
                  <FaTrash /> Удалить
                </button>
              </div>
            )
          )
        )}
      </section>
    </main>
  );
};

export default AdminPanel;
