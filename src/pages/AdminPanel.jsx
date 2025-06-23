import React from "react";
import "../styles/AdminPanel.css"; // Подключаем стили

const AdminPanel = () => {
  return (
    <main className="admin-panel">
      <section className="admin-section">
        <h1>Админ панель</h1>
        <p>Здесь вы можете управлять контентом сайта.</p>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Проект A</td>
              <td>Активный</td>
              <td><button>Редактировать</button></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Проект B</td>
              <td>Ожидание</td>
              <td><button>Редактировать</button></td>
            </tr>
            {/* Добавьте остальные строки по необходимости */}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default AdminPanel;
