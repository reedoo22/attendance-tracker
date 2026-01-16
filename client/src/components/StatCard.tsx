import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: number;
  icon?: ReactNode;
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray';
}

const colorClasses = {
  green: 'bg-green-50 border-green-200 text-green-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  gray: 'bg-gray-50 border-gray-200 text-gray-700',
};

const iconBgClasses = {
  green: 'bg-green-100',
  red: 'bg-red-100',
  yellow: 'bg-yellow-100',
  blue: 'bg-blue-100',
  purple: 'bg-purple-100',
  gray: 'bg-gray-100',
};

export function StatCard({ label, value, icon, color = 'blue' }: StatCardProps) {
  return (
    <Card className={`p-4 border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold font-poppins mt-1">{value}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
