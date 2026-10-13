import { useMemo, useState } from "react";
import { FiArrowRight, FiBookOpen, FiCalendar, FiCheckCircle, FiClock, FiCreditCard, FiPlus, FiUserCheck, FiUsers } from "react-icons/fi";
import { formatMoney, getInitials, todayKey } from "../../data.js";
import styles from "./styles.module.css";

const dayLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());

const Overview = ({ students, classes, attendance, fees, onOpenPage, onAddStudent }) => {
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || "");
  const classStudents = useMemo(() => students.filter((student) => student.classId === selectedClass), [students, selectedClass]);
  const selectedRoom = classes.find((room) => room.id === selectedClass);
  const marks = classStudents.map((student) => attendance[todayKey()]?.[student.id] || "Not marked");
  const allMarks = students.map((student) => attendance[todayKey()]?.[student.id] || "Not marked");
  const presentCount = allMarks.filter((mark) => mark === "Present" || mark === "Late").length;
  const absentCount = allMarks.filter((mark) => mark === "Absent").length;
  const pendingCount = allMarks.filter((mark) => mark === "Not marked").length;
  const classPresentCount = marks.filter((mark) => mark === "Present" || mark === "Late").length;
  const outstanding = fees.reduce((total, fee) => total + Math.max(0, fee.amount - fee.paid), 0);
  const paidCount = fees.filter((fee) => fee.paid >= fee.amount).length;

  return (
    <main className={styles.page}>
      <section className={styles.welcome}>
        <div className={styles.welcomeCopy}>
          <p className={styles.date}><FiCalendar aria-hidden="true" /> {dayLabel}</p>
          <h1>A steady start to the school day.</h1>
          <p className={styles.intro}>A clear view of today's classrooms, student attendance, and family accounts.</p>
          <div className={styles.welcomeActions}>
            <button type="button" className={styles.primaryButton} onClick={() => onOpenPage("/attendance")}><FiUserCheck aria-hidden="true" /> Take attendance</button>
            <button type="button" className={styles.textButton} onClick={onAddStudent}><FiPlus aria-hidden="true" /> Add a student</button>
          </div>
        </div>
        <div className={styles.schoolMark} aria-hidden="true">
          <span className={styles.sun}></span>
          <span className={styles.schoolBuilding}><i></i><i></i><i></i></span>
          <span className={styles.ground}></span>
          <span className={styles.schoolLabel}>BELLWETHER · EST. 1998</span>
        </div>
      </section>

      <section className={styles.summaryGrid} aria-label="School summary">
        <button type="button" className={styles.summaryCard} onClick={() => onOpenPage("/students")}>
          <span className={`${styles.summaryIcon} ${styles.blueIcon}`}><FiUsers aria-hidden="true" /></span>
          <span className={styles.summaryLabel}>Enrolled students</span>
          <strong>{students.length}</strong>
          <small>Across {classes.length} classes <FiArrowRight aria-hidden="true" /></small>
        </button>
        <button type="button" className={styles.summaryCard} onClick={() => onOpenPage("/attendance")}>
          <span className={`${styles.summaryIcon} ${styles.greenIcon}`}><FiCheckCircle aria-hidden="true" /></span>
          <span className={styles.summaryLabel}>Here today</span>
          <strong>{presentCount}<small className={styles.outOf}> / {students.length}</small></strong>
          <small>Present or arriving late <FiArrowRight aria-hidden="true" /></small>
        </button>
        <button type="button" className={styles.summaryCard} onClick={() => onOpenPage("/attendance")}>
          <span className={`${styles.summaryIcon} ${styles.amberIcon}`}><FiClock aria-hidden="true" /></span>
          <span className={styles.summaryLabel}>Attendance to finish</span>
          <strong>{pendingCount}</strong>
          <small>{absentCount} marked absent <FiArrowRight aria-hidden="true" /></small>
        </button>
        <button type="button" className={styles.summaryCard} onClick={() => onOpenPage("/fees")}>
          <span className={`${styles.summaryIcon} ${styles.purpleIcon}`}><FiCreditCard aria-hidden="true" /></span>
          <span className={styles.summaryLabel}>Fees collected</span>
          <strong>{paidCount}<small className={styles.outOf}> / {fees.length}</small></strong>
          <small>{formatMoney(outstanding)} still due <FiArrowRight aria-hidden="true" /></small>
        </button>
      </section>

      <section className={styles.registerSection}>
        <div className={styles.registerHead}>
          <div>
            <p className={styles.sectionLabel}>Classroom register</p>
            <h2>Morning attendance</h2>
            <p className={styles.sectionDescription}>A quick look at the roll before first period.</p>
          </div>
          <div className={styles.registerTools}>
            <label className={styles.classSelect}>
              <span>Class</span>
              <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} aria-label="Choose a class">
                {classes.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
              </select>
            </label>
            <button type="button" className={styles.openRegister} onClick={() => onOpenPage("/attendance")}>Open register <FiArrowRight aria-hidden="true" /></button>
          </div>
        </div>

        {selectedRoom ? (
          <div className={styles.registerBody}>
            <div className={styles.classNote}>
              <span className={styles.teacherBadge}><FiBookOpen aria-hidden="true" /></span>
              <span><strong>{selectedRoom.teacher}</strong><small>{selectedRoom.room} · {classStudents.length} students</small></span>
              <span className={styles.rollSummary}>{classPresentCount} of {classStudents.length} checked in</span>
            </div>
            <div className={styles.studentRows}>
              {classStudents.slice(0, 6).map((student) => {
                const status = attendance[todayKey()]?.[student.id] || "Not marked";
                return (
                  <div className={styles.studentRow} key={student.id}>
                    <span className={`${styles.avatar} ${styles[student.color]}`}>{getInitials(student.name)}</span>
                    <span className={styles.studentName}><strong>{student.name}</strong><small>{student.id}</small></span>
                    <span className={`${styles.attendanceStatus} ${status === "Present" ? styles.present : status === "Late" ? styles.late : status === "Absent" ? styles.absent : styles.pending}`}><i></i>{status}</span>
                  </div>
                );
              })}
              {classStudents.length === 0 && <p className={styles.emptyClass}>No students in this class yet. Add a student to begin the register.</p>}
            </div>
            {classStudents.length > 6 && <button type="button" className={styles.viewAll} onClick={() => onOpenPage("/attendance")}>View all {classStudents.length} students <FiArrowRight aria-hidden="true" /></button>}
          </div>
        ) : (
          <div className={styles.noClasses}><p>No classes are set up yet.</p><button type="button" onClick={() => onOpenPage("/classes")}>Create your first class <FiArrowRight aria-hidden="true" /></button></div>
        )}
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.noteCard}>
          <span className={styles.noteIcon}><FiBookOpen aria-hidden="true" /></span>
          <div><p className={styles.sectionLabel}>This week</p><h2>Keep the day in rhythm.</h2><p>Use the class register to note arrivals, then review fee balances before the term deadline.</p></div>
          <button type="button" onClick={() => onOpenPage("/classes")} aria-label="Open class timetable"><FiArrowRight aria-hidden="true" /></button>
        </article>
        <article className={styles.feeCard}>
          <div className={styles.feeTitle}><div><p className={styles.sectionLabel}>Term 1 · 2026</p><h2>Family fee ledger</h2></div><span><FiCreditCard aria-hidden="true" /></span></div>
          <strong className={styles.feeAmount}>{formatMoney(outstanding)}</strong>
          <p>Outstanding across {fees.filter((fee) => fee.paid < fee.amount).length} student accounts</p>
          <div className={styles.feeBar}><i style={{ width: `${fees.length ? Math.round((paidCount / fees.length) * 100) : 0}%` }} /></div>
          <button type="button" onClick={() => onOpenPage("/fees")}>Review fee records <FiArrowRight aria-hidden="true" /></button>
        </article>
      </section>
    </main>
  );
};

export default Overview;
