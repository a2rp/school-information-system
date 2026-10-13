import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onClose, 3600);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  const Icon = icons[type] || icons.info;

  return (
    <div className={`${styles.toast} ${styles[type]}`} role={type === "error" ? "alert" : "status"} aria-live="polite">
      <Icon aria-hidden="true" />
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification"><FiX aria-hidden="true" /></button>
    </div>
  );
};

export default Toast;
