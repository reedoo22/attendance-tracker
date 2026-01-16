import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Employees table
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: mysqlEnum("position", ["مشرف", "م/مشرف", "فرد"]).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

// Attendance records table
export const attendanceRecords = mysqlTable("attendanceRecords", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  attendanceDate: date("attendanceDate").notNull(),
  status: mysqlEnum("status", ["P", "D/O", "A", "L", "E", "V", "AL", "S/L", "E/L", "U/L", "OFF"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = typeof attendanceRecords.$inferInsert;

// Leaves table
export const leaves = mysqlTable("leaves", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  leaveType: mysqlEnum("leaveType", ["AL", "S/L", "E/L", "U/L"]).notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Leave = typeof leaves.$inferSelect;
export type InsertLeave = typeof leaves.$inferInsert;

// Statistics table
export const statistics = mysqlTable("statistics", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM format
  presentDays: int("presentDays").default(0).notNull(),
  absentDays: int("absentDays").default(0).notNull(),
  lateDays: int("lateDays").default(0).notNull(),
  earlyLeaveDays: int("earlyLeaveDays").default(0).notNull(),
  violations: int("violations").default(0).notNull(),
  totalLeaveDays: int("totalLeaveDays").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Statistic = typeof statistics.$inferSelect;
export type InsertStatistic = typeof statistics.$inferInsert;