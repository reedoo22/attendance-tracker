import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';

interface AttendanceChartProps {
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

export function AttendanceChart({ stats }: AttendanceChartProps) {
  // Prepare data for bar chart
  const barData = [
    { name: 'حضور', value: stats.present, fill: '#22c55e' },
    { name: 'غياب', value: stats.absent, fill: '#ef4444' },
    { name: 'تأخير', value: stats.late, fill: '#f59e0b' },
    { name: 'مخالفة', value: stats.violation, fill: '#991b1b' },
  ];

  // Prepare data for pie chart
  const pieData = [
    { name: 'حضور', value: stats.present },
    { name: 'غياب', value: stats.absent },
    { name: 'تأخير', value: stats.late },
    { name: 'إجازات', value: stats.annualLeave + stats.sickLeave + stats.emergencyLeave + stats.unpaidLeave },
    { name: 'أخرى', value: stats.early + stats.violation + stats.dayOff + stats.holiday },
  ];

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#16a34a', '#6b7280'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-900">إحصائيات الحضور الرئيسية</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#003d82" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Chart */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-900">توزيع الحالات</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
