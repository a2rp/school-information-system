import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./components/confirmDialog/index.jsx";
import Dialog from "./components/dialog/index.jsx";
import Footer from "./components/footer/index.jsx";
import Header from "./components/header/index.jsx";
import StudentForm from "./components/studentForm/index.jsx";
import Toast from "./components/toast/index.jsx";
import AppRoutes from "./AppRoutes.jsx";
import { seedAttendance, seedClasses, seedFees, seedStudents, todayKey } from "./data.js";
import styles from "./App.module.css";

const App = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState(seedStudents);
  const [classes, setClasses] = useState(seedClasses);
  const [attendance, setAttendance] = useState(() => ({ [todayKey()]: seedAttendance }));
  const [fees, setFees] = useState(seedFees);
  const [studentDialog, setStudentDialog] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };
  const clearToast = useCallback(() => setToast(null), []);

  const openStudentForm = () => {
    if (!classes.length) {
      navigate("/classes");
      notify("Create a class before adding a student.", "info");
      return;
    }
    setStudentDialog({ student: null });
  };

  const saveStudent = (form) => {
    const current = studentDialog?.student;
    const occupied = students.filter((student) => student.classId === form.classId && student.id !== current?.id).length;
    const room = classes.find((classroom) => classroom.id === form.classId);
    if (room && occupied >= Number(room.capacity)) {
      notify(`${room.name} is at its ${room.capacity}-student capacity. Choose another class.`, "error");
      return;
    }

    if (current) {
      setStudents((list) => list.map((student) => student.id === current.id ? { ...student, ...form } : student));
      notify(`${form.name}’s school record has been updated.`);
    } else {
      const lastId = students.reduce((max, student) => Math.max(max, Number(student.id.replace("BW-", "")) || 0), 2600);
      const student = {
        ...form,
        id: `BW-${lastId + 1}`,
        joined: todayKey(),
        status: "Active",
        color: ["blue", "rose", "gold", "green", "violet"][students.length % 5],
      };
      setStudents((list) => [...list, student]);
      setFees((list) => [...list, { id: `F-${String(lastId + 1).slice(-4)}`, studentId: student.id, term: "Term 1 · 2026", amount: 18500, paid: 0, dueDate: "2026-10-20" }]);
      notify(`${form.name} has been added to ${room?.name || "the student directory"}.`);
    }
    setStudentDialog(null);
  };

  const removeStudent = (student) => {
    setConfirmation({ kind: "student", item: student });
  };

  const confirmRemoval = () => {
    const student = confirmation?.item;
    if (!student) return;
    setStudents((list) => list.filter((record) => record.id !== student.id));
    setFees((list) => list.filter((record) => record.studentId !== student.id));
    setAttendance((current) => Object.fromEntries(Object.entries(current).map(([date, marks]) => {
      const nextMarks = { ...marks };
      delete nextMarks[student.id];
      return [date, nextMarks];
    })));
    setConfirmation(null);
    notify(`${student.name} was removed from the school records.`);
  };

  const addClass = (room) => {
    setClasses((list) => [...list, room]);
    notify(`${room.name} is ready for students.`);
  };

  const editClass = (updatedRoom) => {
    setClasses((list) => list.map((room) => room.id === updatedRoom.id ? updatedRoom : room));
    notify(`${updatedRoom.name} details have been saved.`);
  };

  const removeClass = (room) => {
    setClasses((list) => list.filter((item) => item.id !== room.id));
    notify(`${room.name} was removed from the school setup.`);
  };

  const updateAttendance = (date, studentId, status) => {
    setAttendance((current) => {
      const marks = { ...(current[date] || {}) };
      if (status) marks[studentId] = status;
      else delete marks[studentId];
      return { ...current, [date]: marks };
    });
    const student = students.find((record) => record.id === studentId);
    notify(status ? `${student?.name || "Student"} marked ${status.toLowerCase()}.` : `${student?.name || "Student"}’s attendance cleared.`, status === "Absent" ? "info" : "success");
  };

  const markAllPresent = (date, roster) => {
    if (!roster.length) return;
    setAttendance((current) => {
      const marks = { ...(current[date] || {}) };
      roster.forEach((student) => { marks[student.id] = "Present"; });
      return { ...current, [date]: marks };
    });
    notify(`${roster.length} shown ${roster.length === 1 ? "student was" : "students were"} marked present.`);
  };

  const recordPayment = (feeId, amount) => {
    setFees((list) => list.map((fee) => fee.id === feeId ? { ...fee, paid: Math.min(fee.amount, fee.paid + amount) } : fee));
  };

  const pageProps = {
    overview: { students, classes, attendance, fees, onOpenPage: navigate, onAddStudent: openStudentForm },
    students: { students, classes, onAddStudent: openStudentForm, onEditStudent: (student) => setStudentDialog({ student }), onRequestDelete: removeStudent },
    attendance: { students, classes, attendance, onUpdateAttendance: updateAttendance, onMarkAllPresent: markAllPresent },
    classes: { classes, students, onAddClass: addClass, onEditClass: editClass, onDeleteClass: removeClass, onNotify: notify },
    fees: { students, classes, fees, onRecordPayment: recordPayment, onNotify: notify },
  };

  return (
    <div className={styles.appShell}>
      <Header onAddStudent={openStudentForm} />
      <AppRoutes pageProps={pageProps} />
      <Footer />
      {studentDialog && <Dialog title={studentDialog.student ? "Edit student record" : "Add a student"} description="Keep the class list and family contact details accurate." onClose={() => setStudentDialog(null)}><StudentForm key={studentDialog.student?.id || "new-student"} student={studentDialog.student} classes={classes} onSave={saveStudent} onCancel={() => setStudentDialog(null)} /></Dialog>}
      {confirmation?.kind === "student" && <ConfirmDialog title="Remove this student?" description={`${confirmation.item.name} will be removed from the directory, attendance records, and sample fee ledger. This cannot be undone.`} confirmLabel="Remove student" onClose={() => setConfirmation(null)} onConfirm={confirmRemoval} />}
      <Toast key={toast?.id} message={toast?.message} type={toast?.type} onClose={clearToast} />
    </div>
  );
};

export default App;
