import { useMemo, useState } from "react";
import { FiArrowDown, FiArrowRight, FiEdit2, FiMail, FiPhone, FiPlus, FiSearch, FiTrash2, FiUser, FiUsers, FiX } from "react-icons/fi";
import Dialog from "../../components/dialog/index.jsx";
import { getInitials } from "../../data.js";
import styles from "./styles.module.css";

const Students = ({ students, classes, onAddStudent, onEditStudent, onRequestDelete }) => {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const visibleStudents = useMemo(() => {
    const search = query.trim().toLowerCase();
    return students
      .filter((student) => classFilter === "all" || student.classId === classFilter)
      .filter((student) => !search || [student.name, student.id, student.guardian, student.email].some((value) => value.toLowerCase().includes(search)))
      .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : b.joined.localeCompare(a.joined));
  }, [students, query, classFilter, sortBy]);
  const className = (id) => classes.find((room) => room.id === id)?.name || "Unassigned";
  const filtersActive = query || classFilter !== "all" || sortBy !== "name";

  return (
    <main className={styles.page}>
      <div className={styles.pageHeading}>
        <div><p className={styles.breadcrumb}>School office <FiArrowRight aria-hidden="true" /> Student records</p><h1>Student directory</h1><p>Every learner's school record, together in one place.</p></div>
        <button type="button" className={styles.addButton} onClick={onAddStudent}><FiPlus aria-hidden="true" /> Add student</button>
      </div>

      <section className={styles.directorySummary} aria-label="Student directory summary">
        <div><span className={styles.summaryIcon}><FiUsers aria-hidden="true" /></span><p>Enrolled learners</p><strong>{students.length}</strong></div>
        <div><span className={`${styles.summaryIcon} ${styles.classIcon}`}><FiUser aria-hidden="true" /></span><p>Active classes</p><strong>{classes.length}</strong></div>
        <div className={styles.summaryMessage}><span>School year 2026</span><strong>Small steps add up.</strong><p>Keep family contact details current for every learner.</p></div>
      </section>

      <section className={styles.directory}>
        <div className={styles.directoryHead}>
          <div><h2>All students <span>{visibleStudents.length}</span></h2><p>Search records or narrow the list by class.</p></div>
          <button type="button" className={styles.filterToggle} aria-expanded={showFilters} onClick={() => setShowFilters((open) => !open)}><FiArrowDown aria-hidden="true" /> {showFilters ? "Hide filters" : "Filters"}{filtersActive && <i />}</button>
        </div>
        <div className={`${styles.filters} ${showFilters ? styles.filtersOpen : ""}`}>
          <label className={styles.searchBox}>
            <FiSearch aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a student, guardian, or ID" aria-label="Search students" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><FiX aria-hidden="true" /></button>}
          </label>
          <label className={styles.selectFilter}><span>Class</span><select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option value="all">All classes</option>{classes.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select></label>
          <label className={styles.selectFilter}><span>Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="name">Student name</option><option value="joined">Recently enrolled</option></select></label>
          {filtersActive && <button type="button" className={styles.clearFilters} onClick={() => { setQuery(""); setClassFilter("all"); setSortBy("name"); }}>Clear filters</button>}
        </div>

        {visibleStudents.length ? (
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Student</th><th>Class</th><th>Parent / guardian</th><th>Enrolled</th><th><span className={styles.actionsHeading}>Record actions</span></th></tr></thead>
              <tbody>
                {visibleStudents.map((student) => (
                  <tr key={student.id}>
                    <td><div className={styles.personCell}><span className={`${styles.avatar} ${styles[student.color]}`}>{getInitials(student.name)}</span><span><strong>{student.name}</strong><small>{student.id}</small></span></div></td>
                    <td><span className={styles.classPill}>{className(student.classId)}</span></td>
                    <td><span className={styles.guardianCell}><strong>{student.guardian}</strong><small>{student.email}</small></span></td>
                    <td><span className={styles.enrolledDate}>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${student.joined}T00:00:00`))}</span></td>
                    <td><div className={styles.rowActions}>
                      <button type="button" aria-label={`View ${student.name}`} title="View student" onClick={() => setSelectedStudent(student)}><FiUser aria-hidden="true" /></button>
                      <button type="button" aria-label={`Edit ${student.name}`} title="Edit student" onClick={() => onEditStudent(student)}><FiEdit2 aria-hidden="true" /></button>
                      <button type="button" className={styles.deleteButton} aria-label={`Remove ${student.name}`} title="Remove student" onClick={() => onRequestDelete(student)}><FiTrash2 aria-hidden="true" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}><span><FiSearch aria-hidden="true" /></span><h3>No students found</h3><p>{students.length ? "Try a different name or class filter." : "Add a student to start the school directory."}</p>{students.length ? <button type="button" onClick={() => { setQuery(""); setClassFilter("all"); }}>Reset filters</button> : <button type="button" onClick={onAddStudent}><FiPlus aria-hidden="true" /> Add first student</button>}</div>
        )}
        <div className={styles.tableFooter}><span>Showing {visibleStudents.length} of {students.length} students</span><span>Changes are kept for this visit only</span></div>
      </section>

      <section className={styles.supportNote}><span><FiUser aria-hidden="true" /></span><div><strong>Family details stay private.</strong><p>These sample records live only in this page session and reset when you refresh.</p></div></section>

      {selectedStudent && (
        <Dialog title="Student record" description={`${selectedStudent.id} · ${className(selectedStudent.classId)}`} onClose={() => setSelectedStudent(null)}>
          <div className={styles.profileDialog}>
            <div className={styles.profileHeading}><span className={`${styles.profileAvatar} ${styles[selectedStudent.color]}`}>{getInitials(selectedStudent.name)}</span><div><h3>{selectedStudent.name}</h3><span className={styles.activeLabel}><i /> Active enrolment</span></div></div>
            <div className={styles.profileDetails}>
              <div><span>Parent or guardian</span><strong>{selectedStudent.guardian}</strong></div>
              <a href={`mailto:${selectedStudent.email}`}><FiMail aria-hidden="true" /><span><small>Email</small><strong>{selectedStudent.email}</strong></span></a>
              <a href={`tel:${selectedStudent.phone.replace(/\s/g, "")}`}><FiPhone aria-hidden="true" /><span><small>Phone</small><strong>{selectedStudent.phone}</strong></span></a>
              <div><span>Enrolled since</span><strong>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${selectedStudent.joined}T00:00:00`))}</strong></div>
            </div>
            <div className={styles.profileActions}><button type="button" className={styles.cancelButton} onClick={() => setSelectedStudent(null)}>Close</button><button type="button" className={styles.editButton} onClick={() => { const current = selectedStudent; setSelectedStudent(null); onEditStudent(current); }}><FiEdit2 aria-hidden="true" /> Edit record</button></div>
          </div>
        </Dialog>
      )}
    </main>
  );
};

export default Students;
