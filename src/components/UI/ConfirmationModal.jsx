import { useRef, useEffect } from "react";

export default function ConfirmationModal({ open, onClose, title, message, onConfirm }) {
    const dialogRef = useRef();

    useEffect(() => {
        if (open) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [open]);

    function handleConfirm() {
        onConfirm();
        onClose();
    }

    return (
        <dialog
            className="modal-dialog"
            ref={dialogRef}
            onClose={onClose}
        >
            <div className="modal-content">
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="btn btn-confirm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </dialog>
    );
}