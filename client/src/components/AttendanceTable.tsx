import { useRef, useEffect } from 'react';
import { EMPLOYEES, DAYS_AR, DAYS_EN, POSITION_COLORS } from '@/lib/constants';
import { AttendanceCell } from './AttendanceCell';
import { Card } from '@/components/ui/card';

interface AttendanceTableProps {
  dates: Date[];
  attendance: { [employeeId: number]: { [dateString: string]: string } };
  onAttendanceChange: (employeeId: number, dateStr: string, code: string) => void;
  dailyCounts: { [dateStr: string]: number };
  readOnly?: boolean;
}

export function AttendanceTable({
  dates,
  attendance,
  onAttendanceChange,
  dailyCounts,
  readOnly = false
}: AttendanceTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to today's date
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayIndex = dates.findIndex(d => d.toISOString().split('T')[0] === todayStr);
    
    if (todayIndex !== -1 && tableRef.current) {
      const scrollLeft = todayIndex * 80; // Approximate column width
      setTimeout(() => {
        tableRef.current?.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }, 100);
    }
  }, [dates]);

  return (
    <div className="space-y-4">
      {/* Header with shift info */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">الوردية المسائية</h2>
        <p className="text-blue-100">04:00م - 01:00ص | Evening Shift (04:00 PM - 01:00 AM)</p>
      </div>

      {/* Daily attendance count */}
      <Card className="p-4 bg-yellow-50 border-2 border-yellow-200">
        <h3 className="text-sm font-semibold text-yellow-900 mb-3">إجمالي الحضور اليومي</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-2">
            {dates.map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const count = dailyCounts[dateStr] || 0;
              return (
                <div key={dateStr} className="flex-shrink-0 text-center">
                  <div className="text-xs text-yellow-700 font-semibold">{date.getDate()}</div>
                  <div className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded font-bold text-sm">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Main table */}
      <div ref={tableRef} className="overflow-x-auto rounded-lg border-2 border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-right font-bold text-gray-900 w-12 bg-gray-50">م</th>
              <th className="px-4 py-3 text-right font-bold text-gray-900 w-40 bg-yellow-50">الاسم</th>
              <th className="px-4 py-3 text-center font-bold text-gray-900 w-28 bg-gray-50">المسمى</th>
              {dates.map((date) => {
                const dayIndex = date.getDay();
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <th
                    key={dateStr}
                    className="px-2 py-3 text-center font-bold text-gray-900 w-20 bg-gray-100 border-l border-gray-300"
                  >
                    <div className="text-xs font-semibold text-gray-600">{date.getDate()}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <div>{DAYS_AR[dayIndex]}</div>
                      <div>{DAYS_EN[dayIndex]}</div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {EMPLOYEES.map((employee, idx) => (
              <tr
                key={employee.id}
                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 text-center font-semibold text-gray-900 bg-gray-50">
                  {employee.id}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 bg-yellow-50">
                  {employee.name}
                </td>
                <td className={`px-4 py-3 text-center text-sm font-semibold rounded ${POSITION_COLORS[employee.position as keyof typeof POSITION_COLORS]}`}>
                  {employee.position}
                </td>
                {dates.map((date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const value = attendance[employee.id]?.[dateStr] || 'P';
                  return (
                    <td
                      key={`${employee.id}-${dateStr}`}
                      className="px-2 py-2 border-l border-gray-300"
                    >
                      <AttendanceCell
                        value={value}
                        onChange={(newValue) => onAttendanceChange(employee.id, dateStr, newValue)}
                        dateStr={dateStr}
                        readOnly={readOnly}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
