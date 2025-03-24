import React from "react";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2> ⚠️MARCUS DANGER⚠️</h2>
        <p>This action cannot be undone.</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn btn-danger">Delete</button>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;