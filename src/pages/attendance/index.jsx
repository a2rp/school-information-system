import { useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiCheck, FiCheckCircle, FiClock, FiSearch, FiUserCheck, FiUsers } from "react-icons/fi";
import { getInitials, todayKey } from "../../data.js";
import styles from "./styles.module.css";

const statusOptions = [
  { label: "Present", short: "P", Icon: FiCheckCircle },
  { label: "Late", short: "L", Icon: FiClock },
  { label: "Absent", short: "A", Icon: FiUsers },
  { label: "Excused", short: "E", Icon: FiCheck },
];

const Attendance = ({ students, classes, attendance, onUpdateAttendance, onMarkAllPresent }) => {
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [query, setQuery] = useState("");
  const room = classes.find((classroom) => classroom.id === selectedClass);
  const classStudents = useMemo(() => students
    .filter((student) => student.classId === selectedClass)
    .filter((student) => !query.trim() || `${student.name} ${student.id}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)), [students, selectedClass, query]);
  const dateMarks = attendance[selectedDate] || {};
  const counts = statusOptions.reduce((result, status) => ({ ...result, [status.label]: students.filter((student) => student.classId === selectedClass && dateMarks[student.id] === status.label).length }), {});
  const markedCount = statusOptions.reduce((total, status) => total + counts[status.label], 0);
  const notMarked = students.filter((student) => student.classId === selectedClass && !dateMarks[student.id]).length;
  const dateText = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${selectedDate}T00:00:00`));

  return (
    <main className={styles.page}>
      <div className={styles.pageHeading}>
        <div><p className={styles.breadcrumb}>School office <FiArrowRight aria-hidden="true" /> Daily register</p><h1>Attendance register</h1><p>Record arrivals for each class and keep the school roll current.</p></div>
        <div className={styles.headingMark}><FiUserCheck aria-hidden="true" /><span><strong>{markedCount} / {students.filter((student) => student.classId === selectedClass).length}</strong><small>records completed</small></span></div>
      </div>

      <section className={styles.classStrip}>
        <div className={styles.filters}>
          <label><span>Class</span><select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}><option value="">Choose a class</option>{classes.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name}</option>)}</select></label>
          <label><span>Date</span><div><FiCalendar aria-hidden="true" /><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} aria-label="Attendance date" /></div></label>
        </div>
        <div className={styles.classDescription}>
          <span className={styles.classIcon}><FiUsers aria-hidden="true" /></span>
          <span><strong>{room?.name || "No class selected"}</strong><small>{room ? `${room.teacher} · ${room.room}` : "Add a class before taking attendance"}</small></span>
          <strong className={styles.dateLabel}>{dateText}</strong>
        </div>
      </section>

      <section className={styles.rollSummary} aria-label="Attendance totals">
        {statusOptions.map(({ label, Icon }) => (
          <div className={`${styles.rollMetric} ${styles[label.toLowerCase()]}`} key={label}><span><Icon aria-hidden="true" /></span><div><small>{label}</small><strong>{counts[label]}</strong></div></div>
        ))}
        <div className={`${styles.rollMetric} ${styles.unmarked}`}><span><FiClock aria-hidden="true" /></span><div><small>Not marked</small><strong>{notMarked}</strong></div></div>
      </section>

      <section className={styles.registerCard}>
        <div className={styles.registerToolbar}>
          <div><p className={styles.registerLabel}>Class register</p><h2>{room?.name || "Choose a class"}</h2><p className={styles.toolbarNote}>{classStudents.length} {classStudents.length === 1 ? "student" : "students"} shown for {dateText}</p></div>
          <div className={styles.toolbarActions}>
            <label className={styles.studentSearch}><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find student" aria-label="Find a student" /></label>
            <button type="button" className={styles.markAllButton} disabled={!classStudents.length} onClick={() => onMarkAllPresent(selectedDate, classStudents)}><FiCheck aria-hidden="true" /> Mark shown present</button>
          </div>
        </div>

        {classStudents.length ? (
          <div className={styles.roster}>
            <div className={styles.rosterHead}><span>Student</span><span>Arrival status</span></div>
            {classStudents.map((student, index) => {
              const value = dateMarks[student.id] || "";
              return (
                <div className={styles.rosterRow} key={student.id}>
                  <span className={styles.rollNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={`${styles.avatar} ${styles[student.color]}`}>{getInitials(student.name)}</span>
                  <span className={styles.studentName}><strong>{student.name}</strong><small>{student.id} · {student.guardian}</small></span>
                  <div className={styles.statusChoices} role="group" aria-label={`Set attendance for ${student.name}`}>
                    {statusOptions.map(({ label, short }) => (
                      <button key={label} type="button" className={`${styles.statusButton} ${styles[label.toLowerCase()]} ${value === label ? styles.selected : ""}`} aria-pressed={value === label} aria-label={`${label} for ${student.name}`} title={label} onClick={() => onUpdateAttendance(selectedDate, student.id, value === label ? "" : label)}><span className={styles.statusLong}>{label}</span><span className={styles.statusShort}>{short}</span></button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyRegister}><span><FiUsers aria-hidden="true" /></span><h3>{room ? "No students in this class" : "Set up a class first"}</h3><p>{room ? "Add students from the student directory to take attendance." : "Create a class, then add learners to open its attendance register."}</p></div>
        )}

        <div className={styles.registerFooter}><span><i className={styles.presentDot} /> Present <i className={styles.lateDot} /> Late <i className={styles.absentDot} /> Absent <i className={styles.excusedDot} /> Excused</span><span>Demo records reset when you refresh</span></div>
      </section>
      <p className={styles.helper}><FiCheckCircle aria-hidden="true" /> Choose a status to update the register immediately. Select an active status again to clear it.</p>
    </main>
  );
};

export default Attendance;
