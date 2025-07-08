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
import { useTranslation } from "react-i18next";
import "../styles/AdminPanel.css";

let db = null;

const AdminPanel = ({ enableExport = true }) => {
  const { t } = useTranslation();

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
      console.error("Error loading data:", err.message);
      setError(t("admin.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
    const confirmed = window.confirm(t("admin.confirmDelete"));
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, "submissions", id));
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(t("admin.deleteFail"));
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
    const adminPass = process.env.REACT_APP_ADMIN_PASS?.trim();
    if (!adminPass) {
      setError("⚠️ " + t("admin.noEnvPassword"));
      return;
    }
    if (password.trim() !== adminPass) {
      setError(t("admin.wrongPassword"));
      return;
    }
    setAuthenticated(true);
    setPassword("");
    setError("");
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
          <title>{t("admin.loginTitle")}</title>
        </Helmet>
        <h2>🔐 {t("admin.loginHeading")}</h2>
        <input
          type="password"
          placeholder={t("admin.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} disabled={!password.trim()}>
          {t("admin.loginBtn")}
        </button>
        {error && <p className="error-text">{error}</p>}
      </main>
    );
  }

  return (
    <main className="admin-panel">
      <Helmet>
        <title>{t("admin.panelTitle")}</title>
      </Helmet>
      <h1>{t("admin.heading")}</h1>
      {loading && <p>⏳ {t("admin.loading")}</p>}
      {error && <p className="error-text">{error}</p>}
      {views !== null && (
        <p>
          👁 {t("admin.views")}: <strong>{views}</strong>
        </p>
      )}
      <input
        type="text"
        placeholder={t("admin.search")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginTop: 10, padding: 8, width: "100%", maxWidth: 400 }}
      />
      {filteredSubmissions.length === 0 && !loading ? (
        <p>{t("admin.noSubmissions")}</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t("admin.name")}</th>
              <th>Email</th>
              <th>{t("admin.phone")}</th>
              <th>{t("admin.message")}</th>
              <th>{t("admin.date")}</th>
              <th>{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(({ id, name, email, phone, message, createdAt }) => (
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
                  <button onClick={() => handleDelete(id)}>🗑 {t("admin.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {enableExport && submissions.length > 0 && (
        <button onClick={exportToExcel} className="export-btn">
          ⬇️ {t("admin.export")}
        </button>
      )}
    </main>
  );
};

export default AdminPanel;
