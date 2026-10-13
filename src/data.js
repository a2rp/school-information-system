export const seedClasses = [
  { id: "5A", name: "Grade 5 · A", grade: "Grade 5", section: "A", teacher: "Priya Nair", room: "North 204", capacity: 28, subjects: ["English", "Mathematics", "Science", "Social studies"] },
  { id: "5B", name: "Grade 5 · B", grade: "Grade 5", section: "B", teacher: "Arjun Mehta", room: "North 206", capacity: 28, subjects: ["English", "Mathematics", "Science", "Art"] },
  { id: "6A", name: "Grade 6 · A", grade: "Grade 6", section: "A", teacher: "Meera Iyer", room: "East 112", capacity: 30, subjects: ["English", "Mathematics", "Science", "Social studies"] },
];

export const seedStudents = [
  { id: "BW-2601", name: "Aarav Sharma", classId: "5A", guardian: "Kavita Sharma", email: "kavita.sharma@example.com", phone: "+91 98765 12001", joined: "2025-04-08", status: "Active", color: "blue" },
  { id: "BW-2602", name: "Anaya Patel", classId: "5A", guardian: "Rohan Patel", email: "rohan.patel@example.com", phone: "+91 98765 12002", joined: "2025-04-08", status: "Active", color: "rose" },
  { id: "BW-2603", name: "Dev Malhotra", classId: "5A", guardian: "Nisha Malhotra", email: "nisha.m@example.com", phone: "+91 98765 12003", joined: "2025-04-09", status: "Active", color: "gold" },
  { id: "BW-2604", name: "Diya Kapoor", classId: "5A", guardian: "Amit Kapoor", email: "amit.kapoor@example.com", phone: "+91 98765 12004", joined: "2025-04-11", status: "Active", color: "green" },
  { id: "BW-2605", name: "Ishaan Verma", classId: "5A", guardian: "Pooja Verma", email: "pooja.verma@example.com", phone: "+91 98765 12005", joined: "2025-04-11", status: "Active", color: "violet" },
  { id: "BW-2606", name: "Kiara Rao", classId: "5B", guardian: "Sanjay Rao", email: "sanjay.rao@example.com", phone: "+91 98765 12006", joined: "2025-04-12", status: "Active", color: "rose" },
  { id: "BW-2607", name: "Kabir Singh", classId: "5B", guardian: "Neha Singh", email: "neha.singh@example.com", phone: "+91 98765 12007", joined: "2025-04-12", status: "Active", color: "blue" },
  { id: "BW-2608", name: "Meera Joshi", classId: "5B", guardian: "Sonal Joshi", email: "sonal.joshi@example.com", phone: "+91 98765 12008", joined: "2025-04-14", status: "Active", color: "green" },
  { id: "BW-2609", name: "Reyansh Gupta", classId: "5B", guardian: "Asha Gupta", email: "asha.gupta@example.com", phone: "+91 98765 12009", joined: "2025-04-14", status: "Active", color: "gold" },
  { id: "BW-2610", name: "Saanvi Das", classId: "6A", guardian: "Ritu Das", email: "ritu.das@example.com", phone: "+91 98765 12010", joined: "2025-04-16", status: "Active", color: "violet" },
  { id: "BW-2611", name: "Vivaan Khanna", classId: "6A", guardian: "Manish Khanna", email: "manish.k@example.com", phone: "+91 98765 12011", joined: "2025-04-16", status: "Active", color: "blue" },
  { id: "BW-2612", name: "Zoya Fernandes", classId: "6A", guardian: "Maria Fernandes", email: "maria.f@example.com", phone: "+91 98765 12012", joined: "2025-04-18", status: "Active", color: "rose" },
  { id: "BW-2613", name: "Arjun Bose", classId: "6A", guardian: "Tanya Bose", email: "tanya.bose@example.com", phone: "+91 98765 12013", joined: "2025-04-19", status: "Active", color: "green" },
  { id: "BW-2614", name: "Myra Chawla", classId: "5A", guardian: "Sameer Chawla", email: "sameer.c@example.com", phone: "+91 98765 12014", joined: "2025-04-20", status: "Active", color: "gold" },
];

export const seedAttendance = {
  "BW-2601": "Present", "BW-2602": "Present", "BW-2603": "Late", "BW-2604": "Present",
  "BW-2605": "Present", "BW-2606": "Absent", "BW-2607": "Present", "BW-2608": "Present",
  "BW-2609": "Present", "BW-2610": "Present", "BW-2611": "Late", "BW-2612": "Present",
  "BW-2613": "Present", "BW-2614": "Present",
};

export const seedFees = seedStudents.map((student, index) => ({
  id: `F-${student.id.slice(-4)}`,
  studentId: student.id,
  term: "Term 1 · 2026",
  amount: 18500,
  paid: [0, 2, 3, 5, 7, 9, 11, 13].includes(index) ? 18500 : [1, 6, 10].includes(index) ? 10000 : 0,
  dueDate: "2026-10-20",
}));

export const todayKey = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export const formatMoney = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(amount || 0);

export const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
