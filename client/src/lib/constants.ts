export const SHIFT_INFO = {
  name: "الوردية المسائية",
  nameEn: "Evening Shift",
  time: "04:00م - 01:00ص",
  timeEn: "04:00 PM - 01:00 AM"
};

export const EMPLOYEES = [
  { id: 1, name: "رائد الحربي", position: "مشرف" },
  { id: 2, name: "ياسر حمود الخيبري", position: "م/مشرف" },
  { id: 3, name: "سلطان طلال يونس", position: "فرد" },
  { id: 4, name: "ابراهيم محمد الهوسة", position: "فرد" },
  { id: 5, name: "عبد اللّٰه عبد السلام التمبكتي", position: "فرد" },
  { id: 6, name: "عبد الرحمن عبد العلام القريشي", position: "فرد" },
  { id: 7, name: "عبد اللّٰه الشريف", position: "فرد" },
  { id: 8, name: "ابراهيم محمد مسلمي", position: "فرد" },
  { id: 9, name: "فارس منصور الجهني", position: "فرد" },
  { id: 10, name: "(دعم 1)", position: "فرد" }
];

export const ATTENDANCE_CODES = {
  P: { label: "حضور", labelEn: "Present", color: "bg-green-100", textColor: "text-green-800", borderColor: "border-green-300" },
  "D/O": { label: "راحة", labelEn: "Day Off", color: "bg-cyan-100", textColor: "text-cyan-800", borderColor: "border-cyan-300" },
  A: { label: "غياب", labelEn: "Absent", color: "bg-red-100", textColor: "text-red-800", borderColor: "border-red-300" },
  L: { label: "تأخير", labelEn: "Late", color: "bg-yellow-100", textColor: "text-yellow-800", borderColor: "border-yellow-300" },
  E: { label: "خروج مبكر", labelEn: "Early Leave", color: "bg-orange-100", textColor: "text-orange-800", borderColor: "border-orange-300" },
  V: { label: "مخالفة", labelEn: "Violation", color: "bg-red-900", textColor: "text-white", borderColor: "border-red-900" },
  AL: { label: "إجازة سنوية", labelEn: "Annual Leave", color: "bg-emerald-100", textColor: "text-emerald-800", borderColor: "border-emerald-300" },
  "S/L": { label: "إجازة مرضية", labelEn: "Sick Leave", color: "bg-gray-200", textColor: "text-gray-800", borderColor: "border-gray-300" },
  "E/L": { label: "إجازة اضطرارية", labelEn: "Emergency Leave", color: "bg-amber-100", textColor: "text-amber-800", borderColor: "border-amber-300" },
  "U/L": { label: "إجازة بدون راتب", labelEn: "Unpaid Leave", color: "bg-black", textColor: "text-white", borderColor: "border-black" },
  OFF: { label: "عطلة رسمية", labelEn: "Official Holiday", color: "bg-purple-900", textColor: "text-white", borderColor: "border-purple-900" }
};

export const ATTENDANCE_CODES_ARRAY = Object.keys(ATTENDANCE_CODES);

export const DATE_RANGE = {
  start: new Date(2026, 0, 21), // January 21, 2026
  end: new Date(2026, 1, 20)    // February 20, 2026
};

export const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
export const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const POSITION_COLORS = {
  "مشرف": "bg-orange-100 text-orange-800",
  "م/مشرف": "bg-purple-100 text-purple-800",
  "فرد": "bg-pink-100 text-pink-800"
};
