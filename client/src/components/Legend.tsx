import { Card } from '@/components/ui/card';
import { ATTENDANCE_CODES } from '@/lib/constants';

export function Legend() {
  return (
    <Card className="p-6 border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-gray-900">جدول المفاتيح (Legend)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(ATTENDANCE_CODES).map(([code, info]) => (
          <div key={code} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
            <div className={`w-6 h-6 rounded ${info.color} border-2 ${info.borderColor}`}></div>
            <div className="flex-1">
              <span className="font-semibold text-sm text-gray-900">{code}</span>
              <span className="text-xs text-gray-600 ml-1">- {info.label}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
