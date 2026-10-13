import { useMemo, useState } from "react";
import { FiArrowRight, FiBookOpen, FiCheck, FiChevronRight, FiEdit2, FiMapPin, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import ConfirmDialog from "../../components/confirmDialog/index.jsx";
import Dialog from "../../components/dialog/index.jsx";
import { getInitials } from "../../data.js";
import styles from "./styles.module.css";

const periods = [
  { time: "08:30", title: "Morning circle", type: "advisory" },
  { time: "09:00", title: "English language", type: "lesson" },
  { time: "10:00", title: "Mathematics", type: "lesson" },
  { time: "11:15", title: "Science lab", type: "lab" },
  { time: "12:15", title: "Lunch break", type: "break" },
  { time: "13:00", title: "Creative studies", type: "activity" },
];

const Classes = ({ classes, students, onAddClass, onEditClass, onDeleteClass, onNotify }) => {
  const [selectedId, setSelectedId] = useState(classes[0]?.id || "");
  const [dialogMode, setDialogMode] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [confirmClass, setConfirmClass] = useState(null);
  const [form, setForm] = useState({ grade: "", section: "A", teacher: "", room: "", capacity: "28", subjects: "" });
  const [errors, setErrors] = useState({});
  const selectedRoom = classes.find((room) => room.id === selectedId) || classes[0];
  const selectedStudents = students.filter((student) => student.classId === selectedRoom?.id).sort((a, b) => a.name.localeCompare(b.name));
  const totalSeats = classes.reduce((total, room) => total + Number(room.capacity), 0);
  const filledSeats = students.length;
  const uniqueSubjects = new Set(classes.flatMap((room) => room.subjects)).size;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const timetable = useMemo(() => periods.map((period, index) => ({ ...period, subject: selectedRoom?.subjects[index % (selectedRoom?.subjects.length || 1)] || period.title })), [selectedRoom]);

  const openCreate = () => {
    setEditingClass(null);
    setForm({ grade: "", section: "A", teacher: "", room: "", capacity: "28", subjects: "" });
    setErrors({});
    setDialogMode("edit");
  };

  const openEdit = (room) => {
    setEditingClass(room);
    setForm({ grade: room.grade.replace(/^Grade\s*/i, ""), section: room.section, teacher: room.teacher, room: room.room, capacity: String(room.capacity), subjects: room.subjects.join(", ") });
    setErrors({});
    setDialogMode("edit");
  };

  const submitClass = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.grade.trim()) nextErrors.grade = "Enter a grade number or name.";
    if (!form.section.trim()) nextErrors.section = "Enter a class section.";
    if (form.teacher.trim().length < 2) nextErrors.teacher = "Enter the class teacher's name.";
    if (form.room.trim().length < 2) nextErrors.room = "Enter a room name or number.";
    if (Number(form.capacity) < 1 || Number(form.capacity) > 60) nextErrors.capacity = "Capacity must be between 1 and 60.";
    if (!form.subjects.trim()) nextErrors.subjects = "Add at least one subject.";
    const enrolledCount = students.filter((student) => student.classId === editingClass?.id).length;
    if (editingClass && Number(form.capacity) < enrolledCount) nextErrors.capacity = `At least ${enrolledCount} seats are needed for the current class list.`;
    const duplicate = classes.some((room) => room.id !== editingClass?.id && room.name.toLowerCase() === `grade ${form.grade.trim()} · ${form.section.trim()}`.toLowerCase());
    if (duplicate) nextErrors.grade = "This grade and section already exist.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const updated = {
      id: editingClass?.id || `${form.grade.trim()}${form.section.trim().toUpperCase()}-${Date.now()}`,
      name: `Grade ${form.grade.trim()} · ${form.section.trim().toUpperCase()}`,
      grade: `Grade ${form.grade.trim()}`,
      section: form.section.trim().toUpperCase(),
      teacher: form.teacher.trim(),
      room: form.room.trim(),
      capacity: Number(form.capacity),
      subjects: [...new Set(form.subjects.split(",").map((subject) => subject.trim()).filter(Boolean))],
    };
    if (editingClass) onEditClass(updated);
    else onAddClass(updated);
    setSelectedId(updated.id);
    setDialogMode("");
  };

  const requestDelete = (room) => {
    const inClass = students.filter((student) => student.classId === room.id).length;
    if (inClass) {
      onNotify(`${room.name} still has ${inClass} enrolled ${inClass === 1 ? "student" : "students"}. Move them to another class before removing it.`, "error");
      return;
    }
    setConfirmClass(room);
  };

  return (
    <main className={styles.page}>
      <div className={styles.pageHeading}>
        <div><p className={styles.breadcrumb}>School office <FiArrowRight aria-hidden="true" /> Classes & timetable</p><h1>Classrooms at a glance.</h1><p>Plan rooms, keep class lists current, and see the school day take shape.</p></div>
        <button type="button" className={styles.addButton} onClick={openCreate}><FiPlus aria-hidden="true" /> Create class</button>
      </div>

      <section className={styles.statsStrip} aria-label="Class summary">
        <div><span className={styles.statIcon}><FiBookOpen aria-hidden="true" /></span><span><small>Teaching groups</small><strong>{classes.length}</strong></span></div>
        <div><span className={`${styles.statIcon} ${styles.greenIcon}`}><FiUsers aria-hidden="true" /></span><span><small>Students enrolled</small><strong>{filledSeats}</strong></span></div>
        <div><span className={`${styles.statIcon} ${styles.goldIcon}`}><FiMapPin aria-hidden="true" /></span><span><small>Seats available</small><strong>{Math.max(0, totalSeats - filledSeats)}</strong></span></div>
        <div className={styles.subjectStat}><small>Subjects in rotation</small><strong>{uniqueSubjects}</strong><span>Shared across grade teams</span></div>
      </section>

      <div className={styles.workspace}>
        <section className={styles.classListSection}>
          <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>Class groups</p><h2>Choose a classroom</h2></div><span>{classes.length} active</span></div>
          {classes.length ? (
            <div className={styles.classList}>
              {classes.map((room, index) => {
                const roster = students.filter((student) => student.classId === room.id);
                const fill = room.capacity ? Math.min(100, Math.round((roster.length / room.capacity) * 100)) : 0;
                return (
                  <article key={room.id} className={`${styles.classCard} ${selectedRoom?.id === room.id ? styles.selected : ""}`}>
                    <button type="button" className={styles.classCardMain} onClick={() => setSelectedId(room.id)} aria-pressed={selectedRoom?.id === room.id}>
                      <span className={`${styles.classBadge} ${styles[`badge${index % 3}`]}`}>{room.section}</span>
                      <span className={styles.classInfo}><strong>{room.name}</strong><small>{room.teacher} · Room {room.room}</small><span className={styles.capacityLine}><i><b style={{ width: `${fill}%` }} /></i><em>{roster.length} of {room.capacity} seats</em></span></span>
                      <FiChevronRight className={styles.cardArrow} aria-hidden="true" />
                    </button>
                    <div className={styles.subjects}>{room.subjects.map((subject) => <span key={subject}>{subject}</span>)}</div>
                    <div className={styles.classActions}><button type="button" onClick={() => openEdit(room)}><FiEdit2 aria-hidden="true" /> Edit</button><button type="button" onClick={() => requestDelete(room)}><FiTrash2 aria-hidden="true" /> Remove</button></div>
                  </article>
                );
              })}
            </div>
          ) : <div className={styles.emptyClasses}><span><FiBookOpen aria-hidden="true" /></span><h2>No classes created</h2><p>Create the first teaching group to organize student records and a class timetable.</p><button type="button" className={styles.addButton} onClick={openCreate}><FiPlus aria-hidden="true" /> Create first class</button></div>}
        </section>

        <aside className={styles.classDetails}>
          {selectedRoom ? <>
            <div className={styles.detailHeader}><div><p className={styles.sectionLabel}>Selected classroom</p><h2>{selectedRoom.name}</h2><p>{selectedRoom.teacher} · {selectedRoom.room}</p></div><button type="button" onClick={() => openEdit(selectedRoom)} aria-label={`Edit ${selectedRoom.name}`}><FiEdit2 aria-hidden="true" /></button></div>
            <div className={styles.rosterPreview}><div className={styles.rosterTitle}><strong>Class list</strong><span>{selectedStudents.length} learners</span></div>{selectedStudents.slice(0, 5).map((student) => <div className={styles.miniStudent} key={student.id}><span className={`${styles.avatar} ${styles[student.color]}`}>{getInitials(student.name)}</span><span><strong>{student.name}</strong><small>{student.guardian}</small></span></div>)}{selectedStudents.length > 5 && <p className={styles.moreStudents}>+ {selectedStudents.length - 5} more in this class</p>}{!selectedStudents.length && <p className={styles.noLearners}>No students are assigned to this class yet.</p>}</div>
            <div className={styles.weekPlan}><div className={styles.weekHeading}><div><p className={styles.sectionLabel}>A typical day</p><h3>Learning rhythm</h3></div><span>MON - FRI</span></div><div className={styles.weekDays}>{days.map((day, index) => <span className={index === 0 ? styles.currentDay : ""} key={day}>{day}</span>)}</div><div className={styles.periodList}>{timetable.map((period) => <div className={styles.period} key={period.time}><time>{period.time}</time><i className={styles[period.type]} /><span>{period.subject}</span></div>)}</div><p className={styles.timetableNote}>Sample timetable preview. No calendar is connected.</p></div>
          </> : <div className={styles.noSelection}><span><FiBookOpen aria-hidden="true" /></span><h2>Select a class</h2><p>Choose a class group to review its student list and daily schedule.</p></div>}
        </aside>
      </div>

      {dialogMode && <Dialog title={editingClass ? "Edit class details" : "Create a class"} description="Set up a teaching group for this school year." onClose={() => setDialogMode("")}>
        <form className={styles.classForm} onSubmit={submitClass} noValidate>
          <div className={styles.formGrid}>
            <label><span>Grade</span><input value={form.grade} onChange={(event) => setForm({ ...form, grade: event.target.value })} placeholder="e.g. 7" aria-invalid={Boolean(errors.grade)} />{errors.grade && <small>{errors.grade}</small>}</label>
            <label><span>Section</span><input value={form.section} onChange={(event) => setForm({ ...form, section: event.target.value })} placeholder="e.g. A" aria-invalid={Boolean(errors.section)} />{errors.section && <small>{errors.section}</small>}</label>
            <label><span>Class teacher</span><input value={form.teacher} onChange={(event) => setForm({ ...form, teacher: event.target.value })} placeholder="Teacher name" aria-invalid={Boolean(errors.teacher)} />{errors.teacher && <small>{errors.teacher}</small>}</label>
            <label><span>Room</span><input value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} placeholder="e.g. West 102" aria-invalid={Boolean(errors.room)} />{errors.room && <small>{errors.room}</small>}</label>
            <label><span>Seat capacity</span><input type="number" min="1" max="60" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} aria-invalid={Boolean(errors.capacity)} />{errors.capacity && <small>{errors.capacity}</small>}</label>
            <label className={styles.subjectField}><span>Subjects, separated by commas</span><input value={form.subjects} onChange={(event) => setForm({ ...form, subjects: event.target.value })} placeholder="English, Mathematics, Science" aria-invalid={Boolean(errors.subjects)} />{errors.subjects && <small>{errors.subjects}</small>}</label>
          </div>
          <div className={styles.formActions}><button type="button" onClick={() => setDialogMode("")}>Cancel</button><button type="submit" className={styles.saveClass}><FiCheck aria-hidden="true" /> {editingClass ? "Save class" : "Create class"}</button></div>
        </form>
      </Dialog>}
      {confirmClass && <ConfirmDialog title="Remove this class?" description={`${confirmClass.name} will be removed from the school setup. This cannot be undone.`} confirmLabel="Remove class" onClose={() => setConfirmClass(null)} onConfirm={() => { onDeleteClass(confirmClass); if (selectedId === confirmClass.id) setSelectedId(classes.find((room) => room.id !== confirmClass.id)?.id || ""); setConfirmClass(null); }} />}
    </main>
  );
};

export default Classes;
