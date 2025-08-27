import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/Modal.css';

const Modal = ({ title, onClose, children }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="modal-title">{title}</h3>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;