import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Dialog = ({ title, description, onClose, children, size = "medium" }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`${styles.dialog} ${size === "large" ? styles.large : ""}`} role="dialog" aria-modal="true" aria-labelledby="school-dialog-title">
        <header className={styles.dialogHeader}>
          <div>
            <h2 id="school-dialog-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close dialog"><FiX aria-hidden="true" /></button>
        </header>
        <div className={styles.dialogBody}>{children}</div>
      </section>
    </div>
  );
};

export default Dialog;
