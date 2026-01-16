import { useState } from 'react';
import { ATTENDANCE_CODES, ATTENDANCE_CODES_ARRAY } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AttendanceCellProps {
  value: string;
  onChange: (value: string) => void;
  dateStr: string;
  readOnly?: boolean;
}

export function AttendanceCell({ value, onChange, dateStr, readOnly = false }: AttendanceCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const codeInfo = ATTENDANCE_CODES[value as keyof typeof ATTENDANCE_CODES] || ATTENDANCE_CODES.P;

  if (readOnly) {
    return (
      <div
        className={`
          w-full h-12 border-2 font-semibold text-sm
          flex items-center justify-center rounded
          transition-all duration-200
          ${codeInfo.color}
          ${codeInfo.borderColor}
          ${codeInfo.textColor}
        `}
      >
        {value}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger
        className={`
          w-full h-12 border-2 font-semibold text-sm
          transition-all duration-200
          hover:shadow-md
          ${codeInfo.color}
          ${codeInfo.borderColor}
          ${codeInfo.textColor}
        `}
      >
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {ATTENDANCE_CODES_ARRAY.map((code) => {
          const info = ATTENDANCE_CODES[code as keyof typeof ATTENDANCE_CODES];
          return (
            <SelectItem key={code} value={code}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${info.color}`}></div>
                <span className="font-medium">{code}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
