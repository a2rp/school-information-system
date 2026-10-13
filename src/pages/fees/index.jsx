import { useMemo, useState } from "react";
import { FiArrowRight, FiCheckCircle, FiCreditCard, FiDownload, FiInfo, FiSearch, FiTrendingUp, FiX } from "react-icons/fi";
import Dialog from "../../components/dialog/index.jsx";
import { formatMoney, getInitials } from "../../data.js";
import styles from "./styles.module.css";

const feeStatus = (fee) => fee.paid >= fee.amount ? "Paid" : fee.paid > 0 ? "Partial" : "Due";

const Fees = ({ students, classes, fees, onRecordPayment, onNotify }) => {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All accounts");
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const studentById = useMemo(() => new Map(students.map((student) => [student.id, student])), [students]);
  const totalBilled = fees.reduce((total, fee) => total + fee.amount, 0);
  const collected = fees.reduce((total, fee) => total + fee.paid, 0);
  const outstanding = Math.max(0, totalBilled - collected);
  const outstandingAccounts = fees.filter((fee) => fee.paid < fee.amount).length;
  const visibleFees = useMemo(() => fees
    .filter((fee) => studentById.has(fee.studentId))
    .filter((fee) => classFilter === "all" || studentById.get(fee.studentId).classId === classFilter)
    .filter((fee) => statusFilter === "All accounts" || feeStatus(fee) === statusFilter)
    .filter((fee) => {
      const student = studentById.get(fee.studentId);
      return !query.trim() || `${student.name} ${student.id} ${student.guardian}`.toLowerCase().includes(query.trim().toLowerCase());
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [fees, classFilter, statusFilter, query, studentById]);

  const openPayment = (fee) => {
    setPaymentTarget(fee);
    setAmount(String(fee.amount - fee.paid));
    setPaymentError("");
  };

  const submitPayment = (event) => {
    event.preventDefault();
    const amountNumber = Number(amount);
    const balance = paymentTarget.amount - paymentTarget.paid;
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) { setPaymentError("Enter an amount greater than zero."); return; }
    if (amountNumber > balance) { setPaymentError(`This account has ${formatMoney(balance)} remaining. Enter that amount or less.`); return; }
    onRecordPayment(paymentTarget.id, amountNumber);
    onNotify(`${formatMoney(amountNumber)} demo payment recorded. No real transaction was processed.`, "success");
    setPaymentTarget(null);
  };

  const exportCsv = () => {
    const rows = [["Student", "Student ID", "Class", "Term", "Billed (INR)", "Paid (INR)", "Balance (INR)", "Due date", "Status"]];
    visibleFees.forEach((fee) => {
      const student = studentById.get(fee.studentId);
      const room = classes.find((classroom) => classroom.id === student.classId);
      rows.push([student.name, student.id, room?.name || "Unassigned", fee.term, fee.amount, fee.paid, fee.amount - fee.paid, fee.dueDate, feeStatus(fee)]);
    });
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bellwether-fees-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify(`Downloaded ${visibleFees.length} fee records as CSV.`, "success");
  };

  return (
    <main className={styles.page}>
      <div className={styles.pageHeading}>
        <div><p className={styles.breadcrumb}>School office <FiArrowRight aria-hidden="true" /> Family accounts</p><h1>Fee ledger</h1><p>Review term balances and record sample payments for student accounts.</p></div>
        <button type="button" className={styles.exportButton} onClick={exportCsv}><FiDownload aria-hidden="true" /> Download CSV</button>
      </div>

      <section className={styles.ledgerSummary} aria-label="Fee summary">
        <article className={styles.totalCard}><span className={styles.totalIcon}><FiCreditCard aria-hidden="true" /></span><div><small>Total billed</small><strong>{formatMoney(totalBilled)}</strong><p>Term 1 · 2026</p></div></article>
        <article className={`${styles.totalCard} ${styles.collectedCard}`}><span className={styles.totalIcon}><FiCheckCircle aria-hidden="true" /></span><div><small>Collected</small><strong>{formatMoney(collected)}</strong><p>{fees.filter((fee) => fee.paid >= fee.amount).length} accounts settled in full</p></div></article>
        <article className={`${styles.totalCard} ${styles.balanceCard}`}><span className={styles.totalIcon}><FiTrendingUp aria-hidden="true" /></span><div><small>Balance remaining</small><strong>{formatMoney(outstanding)}</strong><p>Across {outstandingAccounts} family accounts</p></div></article>
      </section>

      <section className={styles.ledger}>
        <div className={styles.ledgerHead}><div><p className={styles.sectionLabel}>Term 1 · 2026</p><h2>Student accounts <span>{visibleFees.length}</span></h2><p>Balances are sample records for this frontend demonstration.</p></div><div className={styles.termChip}>Due date <strong>20 Oct 2026</strong></div></div>
        <div className={styles.filters}>
          <label className={styles.searchBox}><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, guardian, or ID" aria-label="Search fee records" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><FiX aria-hidden="true" /></button>}</label>
          <label className={styles.selectFilter}><span>Class</span><select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option value="all">All classes</option>{classes.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select></label>
          <div className={styles.statusFilters} role="group" aria-label="Filter fee accounts by status">{["All accounts", "Due", "Partial", "Paid"].map((status) => <button type="button" className={statusFilter === status ? styles.activeStatus : ""} key={status} aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>{status}</button>)}</div>
        </div>
        {visibleFees.length ? <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Student</th><th>Term</th><th>Fee progress</th><th>Due date</th><th>Status</th><th>Account action</th></tr></thead>
            <tbody>{visibleFees.map((fee) => {
              const student = studentById.get(fee.studentId);
              const status = feeStatus(fee);
              const balance = fee.amount - fee.paid;
              const progress = Math.min(100, Math.round((fee.paid / fee.amount) * 100));
              const room = classes.find((classroom) => classroom.id === student.classId);
              return <tr key={fee.id}>
                <td><div className={styles.studentCell}><span className={`${styles.avatar} ${styles[student.color]}`}>{getInitials(student.name)}</span><span><strong>{student.name}</strong><small>{student.id} · {room?.name || "Unassigned"}</small></span></div></td>
                <td><span className={styles.termLabel}>{fee.term}</span></td>
                <td><div className={styles.progressCell}><span><strong>{formatMoney(fee.paid)}</strong><small>of {formatMoney(fee.amount)}</small></span><i><b style={{ width: `${progress}%` }} /></i><small className={`${styles.balanceText} ${balance === 0 ? styles.balancePaid : ""}`}>{balance > 0 ? `${formatMoney(balance)} due` : "Fully paid"}</small></div></td>
                <td><span className={styles.dueDate}>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${fee.dueDate}T00:00:00`))}</span></td>
                <td><span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}><i />{status}</span></td>
                <td>{balance > 0 ? <button type="button" className={styles.recordButton} onClick={() => openPayment(fee)}>Record payment <FiArrowRight aria-hidden="true" /></button> : <span className={styles.settled}><FiCheckCircle aria-hidden="true" /> Settled</span>}</td>
              </tr>;
            })}</tbody>
          </table>
        </div> : <div className={styles.emptyLedger}><span><FiCreditCard aria-hidden="true" /></span><h3>No fee records match</h3><p>Try a different search, class, or payment status.</p><button type="button" onClick={() => { setQuery(""); setClassFilter("all"); setStatusFilter("All accounts"); }}>Clear filters</button></div>}
        <div className={styles.ledgerFooter}><span>Showing {visibleFees.length} of {fees.length} accounts</span><span>Payment gateway is not connected</span></div>
      </section>

      <aside className={styles.disclaimer}><FiInfo aria-hidden="true" /><p><strong>Demonstration only.</strong> Recording a payment updates this browser session's sample data. It does not charge a family or contact a payment provider.</p></aside>

      {paymentTarget && <Dialog title="Record a sample payment" description={`${studentById.get(paymentTarget.studentId)?.name} · ${paymentTarget.term}`} onClose={() => setPaymentTarget(null)}>
        <form className={styles.paymentForm} onSubmit={submitPayment} noValidate>
          <div className={styles.paymentBalance}><span>Remaining balance</span><strong>{formatMoney(paymentTarget.amount - paymentTarget.paid)}</strong></div>
          <label><span>Amount received (INR)</span><div className={styles.amountInput}><span>₹</span><input type="number" min="1" max={paymentTarget.amount - paymentTarget.paid} step="1" autoFocus value={amount} onChange={(event) => { setAmount(event.target.value); setPaymentError(""); }} aria-invalid={Boolean(paymentError)} /></div>{paymentError && <small>{paymentError}</small>}</label>
          <button type="button" className={styles.balanceShortcut} onClick={() => { setAmount(String(paymentTarget.amount - paymentTarget.paid)); setPaymentError(""); }}>Use full remaining balance</button>
          <div className={styles.paymentNote}><FiInfo aria-hidden="true" /><span>This only updates sample data in the current browser session. No money will be moved.</span></div>
          <div className={styles.paymentActions}><button type="button" onClick={() => setPaymentTarget(null)}>Cancel</button><button type="submit" className={styles.submitPayment}><FiCheckCircle aria-hidden="true" /> Record sample payment</button></div>
        </form>
      </Dialog>}
    </main>
  );
};

export default Fees;
