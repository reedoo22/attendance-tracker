import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Employee {
  id: number;
  name: string;
  position: string;
  isActive: boolean;
}

interface AttendanceRecord {
  id: number;
  employeeId: number;
  attendanceDate: Date;
  status: string;
  notes?: string;
}

export function useCloudAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from database
  const { data: employeesData, isLoading: employeesLoading } = 
    trpc.attendance.getEmployees.useQuery();

  // Update records mutation
  const updateRecordMutation = trpc.attendance.updateRecord.useMutation({
    onSuccess: () => {
      toast.success('تم حفظ التعديل بنجاح');
    },
    onError: (error) => {
      toast.error('خطأ في حفظ التعديل');
      console.error('Error updating record:', error);
    },
  });

  // Load employees on component mount
  useEffect(() => {
    if (employeesData) {
      const formattedEmployees = (employeesData as any[]).map(emp => ({
        id: emp.id,
        name: emp.name,
        position: emp.position,
        isActive: Boolean(emp.isActive),
      }));
      setEmployees(formattedEmployees);
      setIsLoading(false);
    }
  }, [employeesData]);

  // Update attendance record in database
  const updateAttendance = useCallback(
    (employeeId: number, dateStr: string, status: string) => {
      updateRecordMutation.mutate({
        employeeId,
        attendanceDate: dateStr,
        status: status as any,
        notes: undefined,
      });
    },
    [updateRecordMutation]
  );

  return {
    employees,
    isLoading: isLoading || employeesLoading,
    error,
    updateAttendance,
    isUpdating: updateRecordMutation.isPending,
  };
}
