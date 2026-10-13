import { useState } from "react";
import { FiCheck, FiUser } from "react-icons/fi";
import styles from "./styles.module.css";

const emptyForm = { name: "", classId: "", guardian: "", email: "", phone: "" };

const StudentForm = ({ student, classes, onSave, onCancel }) => {
  const [form, setForm] = useState(() => student ? {
    name: student.name,
    classId: student.classId,
    guardian: student.guardian,
    email: student.email,
    phone: student.phone,
  } : { ...emptyForm, classId: classes[0]?.id || "" });
  const [errors, setErrors] = useState({});

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter the student's full name.";
    if (!form.classId) nextErrors.classId = "Choose a class for this student.";
    if (form.guardian.trim().length < 2) nextErrors.guardian = "Add a parent or guardian name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 8) nextErrors.phone = "Enter a valid contact number.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...form, name: form.name.trim(), guardian: form.guardian.trim(), email: form.email.trim(), phone: form.phone.trim() });
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.intro}><span><FiUser aria-hidden="true" /></span><p>Keep the student's school record and family contact details up to date.</p></div>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>Student name</span>
          <input autoFocus name="name" value={form.name} onChange={updateField} placeholder="e.g. Riya Sharma" aria-invalid={Boolean(errors.name)} />
          {errors.name && <small>{errors.name}</small>}
        </label>
        <label className={styles.field}>
          <span>Class</span>
          <select name="classId" value={form.classId} onChange={updateField} aria-invalid={Boolean(errors.classId)}>
            <option value="">Choose a class</option>
            {classes.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
          </select>
          {errors.classId && <small>{errors.classId}</small>}
        </label>
        <label className={styles.field}>
          <span>Parent or guardian</span>
          <input name="guardian" value={form.guardian} onChange={updateField} placeholder="e.g. Kavita Sharma" aria-invalid={Boolean(errors.guardian)} />
          {errors.guardian && <small>{errors.guardian}</small>}
        </label>
        <label className={styles.field}>
          <span>Guardian email</span>
          <input type="email" name="email" value={form.email} onChange={updateField} placeholder="name@example.com" aria-invalid={Boolean(errors.email)} />
          {errors.email && <small>{errors.email}</small>}
        </label>
        <label className={styles.field}>
          <span>Contact number</span>
          <input type="tel" name="phone" value={form.phone} onChange={updateField} placeholder="+91 98765 43210" aria-invalid={Boolean(errors.phone)} />
          {errors.phone && <small>{errors.phone}</small>}
        </label>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.saveButton}><FiCheck aria-hidden="true" /> {student ? "Save changes" : "Add student"}</button>
      </div>
    </form>
  );
};

export default StudentForm;
