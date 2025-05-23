import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import * as XLSX from "xlsx";

const AdminPanel = ({ enableExport }) => {
  const [submissions, setSubmissions] = useState([]);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchSubmissions();
    }
  }, [authenticated]);

  const fetchSubmissions = async () => {
    const querySnapshot = await getDocs(collection(db, "submissions"));
    setSubmissions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(submissions.map(({ id, ...rest }) => rest));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Заявки");
    XLSX.writeFile(workbook, "submissions.xlsx");
  };

  const handleDelete = async (id) => {
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
          {submissions.map((s, idx) => (
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
