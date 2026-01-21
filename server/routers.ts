import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAttendanceRecords,
  upsertAttendanceRecord,
  getEmployees,
  getEmployeeById,
  getStatistics,
  upsertStatistics,
  addEmployee,
  deleteEmployee
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  attendance: router({
    // Get all employees from database
    getEmployees: publicProcedure
      .query(async () => {
        try {
          const employees = await getEmployees();
          return employees || [];
        } catch (error) {
          console.error('Error fetching employees:', error);
          return [];
        }
      }),

    // Get employee by ID
    getEmployee: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getEmployeeById(input.id);
      }),

    // Get all attendance records for a date range
    getRecords: protectedProcedure
      .input(z.object({
        employeeId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const startDate = input.startDate ? new Date(input.startDate) : undefined;
        const endDate = input.endDate ? new Date(input.endDate) : undefined;
        return await getAttendanceRecords(input.employeeId, startDate, endDate);
      }),

    // Update attendance record
    updateRecord: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        attendanceDate: z.string(),
        status: z.enum(["P", "D/O", "A", "L", "E", "V", "AL", "S/L", "E/L", "U/L", "OFF"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await upsertAttendanceRecord(
          input.employeeId,
          new Date(input.attendanceDate),
          input.status,
          input.notes
        );
      }),

    // Get statistics for an employee in a month
    getStatistics: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        month: z.string(), // YYYY-MM format
      }))
      .query(async ({ input }) => {
        return await getStatistics(input.employeeId, input.month);
      }),

    // Update statistics
    updateStatistics: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        month: z.string(),
        presentDays: z.number().optional(),
        absentDays: z.number().optional(),
        lateDays: z.number().optional(),
        earlyLeaveDays: z.number().optional(),
        violations: z.number().optional(),
        totalLeaveDays: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { employeeId, month, ...stats } = input;
        return await upsertStatistics(employeeId, month, stats);
      }),

    // Add new employee
    addEmployee: protectedProcedure
      .input(z.object({
        name: z.string().min(1, "اسم الموظف مطلوب"),
        position: z.enum(["مشرف", "م/مشرف", "فرد"]),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await addEmployee(input.name, input.position, input.email, input.phone);
      }),

    // Delete employee
    deleteEmployee: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteEmployee(input.employeeId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
