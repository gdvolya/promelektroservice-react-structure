import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Papa from "papaparse";
import "./SubmissionsPanel.css"; // Создайте этот файл для стилей

const SubmissionsPanel = ({ enableExport = false }) => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dbRef = useRef(null);

  useEffect(() => {
    import("../firebaseLazy").then(({ db }) => {
      dbRef.current = db;
      fetchSubmissions();
    }).catch((e) => {
      console.error("Ошибка загрузки Firebase:", e);
      setError("Failed to load Firebase.");
      setLoading(false);
    });
  }, []);

  const fetchSubmissions = () => {
    const db = dbRef.current;
    if (!db) {
      setError("Firebase not initialized.");
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubmissions(list);
        setLoading(false);
      }, (e) => {
        console.error("Ошибка получения заявок:", e);
        setError("Failed to fetch submissions.");
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Ошибка при настройке onSnapshot:", e);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const db = dbRef.current;
    if (!db) {
      setError("Firebase not initialized.");
      return;
    }
    if (window.confirm(t("admin.confirmDelete"))) {
      try {
        await deleteDoc(doc(db, "submissions", id));
      } catch (e) {
        console.error("Ошибка при удалении заявки:", e);
        setError("Failed to delete submission.");
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    const db = dbRef.current;
    if (!db) {
      setError("Firebase not initialized.");
      return;
    }
    try {
      await updateDoc(doc(db, "submissions", id), {
        status: "read",
      });
    } catch (e) {
      console.error("Ошибка при обновлении статуса:", e);
      setError("Failed to update status.");
    }
  };

  const exportToCsv = () => {
    if (!enableExport) return;
    const dataToExport = submissions.map(({ id, ...rest }) => rest);
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "submissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{t("admin.error", { error })}</div>;

  return (
    <div className="submissions-panel">
      <h2>{t("admin.submissionsHeading")}</h2>
      {enableExport && (
        <button className="export-btn" onClick={exportToCsv}>
          {t("admin.exportBtn")}
        </button>
      )}
      <div className="table-responsive">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>{t("admin.status")}</th>
              <th>{t("admin.name")}</th>
              <th>{t("admin.email")}</th>
              <th>{t("admin.phone")}</th>
              <th>{t("admin.message")}</th>
              <th>{t("admin.date")}</th>
              <th>{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} className={sub.status === "read" ? "read" : "new"}>
                <td>{t(`admin.status.${sub.status}`)}</td>
                <td>{sub.name}</td>
                <td>{sub.email}</td>
                <td>{sub.phone}</td>
                <td>{sub.message}</td>
                <td>{new Date(sub.createdAt?.seconds * 1000).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleMarkAsRead(sub.id)} className="read-btn">
                    {t("admin.markAsRead")}
                  </button>
                  <button onClick={() => handleDelete(sub.id)} className="delete-btn">
                    {t("admin.deleteBtn")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionsPanel;