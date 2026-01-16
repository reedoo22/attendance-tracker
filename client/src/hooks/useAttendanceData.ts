import { useState, useCallback, useMemo } from 'react';
import { EMPLOYEES, DATE_RANGE, ATTENDANCE_CODES_ARRAY } from '@/lib/constants';

export type AttendanceRecord = {
  [employeeId: number]: {
    [dateString: string]: string;
  };
};

export const useAttendanceData = () => {
  // Initialize with all dates from the range
  const dates = useMemo(() => {
    const dateArray = [];
    const current = new Date(DATE_RANGE.start);
    while (current <= DATE_RANGE.end) {
      dateArray.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dateArray;
  }, []);

  // Initialize attendance data with "P" for all employees and dates
  const [attendance, setAttendance] = useState<AttendanceRecord>(() => {
    const initial: AttendanceRecord = {};
    EMPLOYEES.forEach(emp => {
      initial[emp.id] = {};
      dates.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        initial[emp.id][dateStr] = 'P';
      });
    });
    return initial;
  });

  const updateAttendance = useCallback((employeeId: number, dateStr: string, code: string) => {
    setAttendance(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [dateStr]: code
      }
    }));
  }, []);

  const getDailyCount = useCallback((dateStr: string, code: string) => {
    let count = 0;
    EMPLOYEES.forEach(emp => {
      if (attendance[emp.id]?.[dateStr] === code) {
        count++;
      }
    });
    return count;
  }, [attendance]);

  const getEmployeeStats = useCallback((employeeId: number) => {
    const empAttendance = attendance[employeeId] || {};
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      early: 0,
      violation: 0,
      annualLeave: 0,
      sickLeave: 0,
      emergencyLeave: 0,
      unpaidLeave: 0,
      dayOff: 0,
      holiday: 0
    };

    Object.values(empAttendance).forEach(code => {
      switch (code) {
        case 'P': stats.present++; break;
        case 'A': stats.absent++; break;
        case 'L': stats.late++; break;
        case 'E': stats.early++; break;
        case 'V': stats.violation++; break;
        case 'AL': stats.annualLeave++; break;
        case 'S/L': stats.sickLeave++; break;
        case 'E/L': stats.emergencyLeave++; break;
        case 'U/L': stats.unpaidLeave++; break;
        case 'D/O': stats.dayOff++; break;
        case 'OFF': stats.holiday++; break;
      }
    });

    return stats;
  }, [attendance]);

  const getTotalStats = useCallback(() => {
    const totals = {
      present: 0,
      absent: 0,
      late: 0,
      early: 0,
      violation: 0,
      annualLeave: 0,
      sickLeave: 0,
      emergencyLeave: 0,
      unpaidLeave: 0,
      dayOff: 0,
      holiday: 0
    };

    EMPLOYEES.forEach(emp => {
      const stats = getEmployeeStats(emp.id);
      Object.keys(totals).forEach(key => {
        totals[key as keyof typeof totals] += stats[key as keyof typeof stats];
      });
    });

    return totals;
  }, [getEmployeeStats]);

  const exportToJSON = useCallback(() => {
    return JSON.stringify(attendance, null, 2);
  }, [attendance]);

  const importFromJSON = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      setAttendance(data);
      return true;
    } catch (error) {
      console.error('Invalid JSON:', error);
      return false;
    }
  }, []);

  return {
    attendance,
    dates,
    updateAttendance,
    getDailyCount,
    getEmployeeStats,
    getTotalStats,
    exportToJSON,
    importFromJSON
  };
};
