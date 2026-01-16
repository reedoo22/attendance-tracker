import { EMPLOYEES } from '@/lib/constants';
import { StatCard } from './StatCard';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, LogOut, AlertTriangle, Leaf, Heart, AlertCircle, Ban, Calendar } from 'lucide-react';

interface EmployeeStatsProps {
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
  totalEmployees: number;
}

export function EmployeeStats({ stats, totalEmployees }: EmployeeStatsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="إجمالي الحضور"
          value={stats.present}
          icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
          color="green"
        />
        <StatCard
          label="إجمالي الغيابات"
          value={stats.absent}
          icon={<XCircle className="w-6 h-6 text-red-600" />}
          color="red"
        />
        <StatCard
          label="إجمالي التأخيرات"
          value={stats.late}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          color="yellow"
        />
        <StatCard
          label="إجمالي المخالفات"
          value={stats.violation}
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          color="red"
        />
      </div>

      {/* Leave Stats */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-900">إحصائيات الإجازات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">إجازة سنوية</p>
            <p className="text-2xl font-bold text-green-700">{stats.annualLeave}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Heart className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">إجازة مرضية</p>
            <p className="text-2xl font-bold text-gray-700">{stats.sickLeave}</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">إجازة اضطرارية</p>
            <p className="text-2xl font-bold text-amber-700">{stats.emergencyLeave}</p>
          </div>
          <div className="text-center p-4 bg-black/5 rounded-lg border border-black/20">
            <Ban className="w-6 h-6 text-black mx-auto mb-2" />
            <p className="text-sm text-gray-600">بدون راتب</p>
            <p className="text-2xl font-bold text-black">{stats.unpaidLeave}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">عطلة رسمية</p>
            <p className="text-2xl font-bold text-purple-700">{stats.holiday}</p>
          </div>
        </div>
      </Card>

      {/* Additional Stats */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-900">إحصائيات إضافية</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <LogOut className="w-6 h-6 text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">خروج مبكر</p>
            <p className="text-2xl font-bold text-orange-700">{stats.early}</p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <Calendar className="w-6 h-6 text-cyan-600 mb-2" />
            <p className="text-sm text-gray-600">راحة</p>
            <p className="text-2xl font-bold text-cyan-700">{stats.dayOff}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <CheckCircle2 className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">إجمالي الموظفين</p>
            <p className="text-2xl font-bold text-blue-700">{totalEmployees}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
