import React from "react";
import "../styles/Modal.css"; // Импортируем стили для модального окна

const Modal = ({ title, message, onConfirm, onCancel, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h3>{title}</h3>}
        {message && <p>{message}</p>}
        {children}
        <div className="modal-buttons">
          {onConfirm && (
            <button onClick={onConfirm} className="confirm-btn">
              Подтвердить
            </button>
          )}
          {onCancel && (
            <button onClick={onCancel} className="cancel-btn">
              {onConfirm ? "Отмена" : "Закрыть"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;