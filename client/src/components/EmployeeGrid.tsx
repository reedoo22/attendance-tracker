import { EMPLOYEES } from '@/lib/constants';
import { EmployeeDetailCard } from './EmployeeDetailCard';

interface EmployeeGridProps {
  attendance: { [employeeId: number]: { [dateString: string]: string } };
  getEmployeeStats: (employeeId: number) => {
    present: number;
    absent: number;
    late: number;
    early: number;
    violation: number;
    annualLeave: number;
    sickLeave: number;
    emergencyLeave: number;
    unpaidLeave: number;
    dayOff: number;
    holiday: number;
  };
}

export function EmployeeGrid({ attendance, getEmployeeStats }: EmployeeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {EMPLOYEES.map((employee) => (
        <EmployeeDetailCard
          key={employee.id}
          employee={employee}
          stats={getEmployeeStats(employee.id)}
        />
      ))}
    </div>
  );
}
