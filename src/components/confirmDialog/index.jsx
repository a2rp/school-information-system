import { FiAlertTriangle } from "react-icons/fi";
import Dialog from "../dialog/index.jsx";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onClose }) => (
  <Dialog title={title} onClose={onClose}>
    <div className={styles.confirmation}>
      <span className={styles.warningIcon}><FiAlertTriangle aria-hidden="true" /></span>
      <p>{description}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>{cancelLabel}</button>
        <button type="button" className={styles.removeButton} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </Dialog>
);

export default ConfirmDialog;
