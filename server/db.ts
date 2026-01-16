import { eq, and, between } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, attendanceRecords, leaves, statistics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Attendance queries
export async function getAttendanceRecords(employeeId?: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [];
  if (employeeId) {
    conditions.push(eq(attendanceRecords.employeeId, employeeId));
  }
  if (startDate && endDate) {
    conditions.push(between(attendanceRecords.attendanceDate, startDate, endDate));
  }

  if (conditions.length > 0) {
    return await db.select().from(attendanceRecords).where(and(...conditions));
  }

  return await db.select().from(attendanceRecords);
}

export async function upsertAttendanceRecord(employeeId: number, attendanceDate: Date, status: string, notes?: string) {
  const db = await getDb();
  if (!db) return null;

  const dateStr = attendanceDate.toISOString().split('T')[0];
  
  try {
    await db.insert(attendanceRecords).values({
      employeeId,
      attendanceDate: new Date(dateStr),
      status: status as any,
      notes
    }).onDuplicateKeyUpdate({
      set: {
        status: status as any,
        notes,
        updatedAt: new Date()
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to upsert attendance record:", error);
    return null;
  }
}

export async function getEmployees() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(employees).where(eq(employees.isActive, 1));
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getStatistics(employeeId: number, month: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(statistics).where(
    and(eq(statistics.employeeId, employeeId), eq(statistics.month, month))
  ).limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function upsertStatistics(employeeId: number, month: string, stats: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(statistics).values({
      employeeId,
      month,
      ...stats
    }).onDuplicateKeyUpdate({
      set: {
        ...stats,
        updatedAt: new Date()
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to upsert statistics:", error);
    return null;
  }
}
