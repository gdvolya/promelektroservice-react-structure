import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import * as XLSX from "xlsx";

let db = null;

const AdminPanel = ({ enableExport }) => {
  const [submissions, setSubmissions] = useState([]);
  const [views, setViews] = useState(null);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated && !db) {
      import("../firebaseLazy").then(({ db: loadedDb }) => {
        db = loadedDb;
        fetchSubmissions();
        fetchViews();
      });
    } else if (authenticated && db) {
      fetchSubmissions();
      fetchViews();
    }
  }, [authenticated]);

  const fetchSubmissions = async () => {
    if (!db) return;
    const querySnapshot = await getDocs(collection(db, "submissions"));
    setSubmissions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchViews = async () => {
    if (!db) return;
    const docRef = doc(db, "views", "home");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setViews(snap.data().count);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(submissions.map(({ id, ...rest }) => rest));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Заявки");
    XLSX.writeFile(workbook, "submissions.xlsx");
  };

  const handleDelete = async (id) => {
    if (!db) return;
    if (window.confirm("Ви впевнені, що хочете видалити цю заявку?")) {
      await deleteDoc(doc(db, "submissions", id));
      fetchSubmissions();
    }
  };

  const handleLogin = () => {
    const isAuth = password === "admin123";
    setAuthenticated(isAuth);
    setPassword("");
  };

  if (!authenticated) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Вхід до адмін-панелі</h2>
        <input
          type="password"
          placeholder="Введіть пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Увійти</button>
      </div>
    );
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Адмін-панель</h1>

      {views !== null && (
        <p>👁 Переглядів на головній сторінці: <strong>{views}</strong></p>
      )}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Ім’я</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Повідомлення</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.message}</td>
              <td>
                <button onClick={() => handleDelete(s.id)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {enableExport && (
        <button onClick={exportToExcel} style={{ marginTop: "20px" }}>
          Експортувати в Excel
        </button>
      )}
    </main>
  );
};

export default AdminPanel;
