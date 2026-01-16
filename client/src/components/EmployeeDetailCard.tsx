import { Card } from '@/components/ui/card';
import { POSITION_COLORS } from '@/lib/constants';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Leaf } from 'lucide-react';

interface EmployeeDetailCardProps {
  employee: {
    id: number;
    name: string;
    position: string;
  };
  stats: {
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

export function EmployeeDetailCard({ employee, stats }: EmployeeDetailCardProps) {
  const totalDays = Object.values(stats).reduce((a, b) => a + b, 0);
  const attendanceRate = totalDays > 0 ? Math.round((stats.present / totalDays) * 100) : 0;

  return (
    <Card className="p-4 border-2 border-gray-200 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900">{employee.name}</h3>
            <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${POSITION_COLORS[employee.position as keyof typeof POSITION_COLORS]}`}>
              {employee.position}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
            <div className="text-xs text-gray-500">معدل الحضور</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-xs text-gray-600">حضور</div>
              <div className="font-bold text-green-600">{stats.present}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <div>
              <div className="text-xs text-gray-600">غياب</div>
              <div className="font-bold text-red-600">{stats.absent}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <div>
              <div className="text-xs text-gray-600">تأخير</div>
              <div className="font-bold text-yellow-600">{stats.late}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <div>
              <div className="text-xs text-gray-600">مخالفة</div>
              <div className="font-bold text-red-600">{stats.violation}</div>
            </div>
          </div>
        </div>

        {/* Leave Stats */}
        {(stats.annualLeave + stats.sickLeave + stats.emergencyLeave + stats.unpaidLeave) > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">الإجازات</div>
            <div className="flex gap-2 flex-wrap">
              {stats.annualLeave > 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  سنوية: {stats.annualLeave}
                </span>
              )}
              {stats.sickLeave > 0 && (
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  مرضية: {stats.sickLeave}
                </span>
              )}
              {stats.emergencyLeave > 0 && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  اضطرارية: {stats.emergencyLeave}
                </span>
              )}
              {stats.unpaidLeave > 0 && (
                <span className="text-xs bg-black/10 text-black px-2 py-1 rounded">
                  بدون راتب: {stats.unpaidLeave}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
