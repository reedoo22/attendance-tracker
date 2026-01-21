import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded?: () => void;
}

export function AddEmployeeDialog({ open, onOpenChange, onEmployeeAdded }: AddEmployeeDialogProps) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<'مشرف' | 'م/مشرف' | 'فرد'>('فرد');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const utils = trpc.useUtils();
  const addEmployeeMutation = trpc.attendance.addEmployee.useMutation({
    onSuccess: () => {
      toast.success('تم إضافة الموظف بنجاح');
      setName('');
      setPosition('فرد');
      setEmail('');
      setPhone('');
      onOpenChange(false);
      utils.attendance.getEmployees.invalidate();
      onEmployeeAdded?.();
    },
    onError: (error) => {
      toast.error('خطأ في إضافة الموظف: ' + (error?.message || 'حدث خطأ غير متوقع'));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('يرجى إدخال اسم الموظف');
      return;
    }

    setIsLoading(true);
    try {
      await addEmployeeMutation.mutateAsync({
        name: name.trim(),
        position,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة موظف جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الموظف *</Label>
            <Input
              id="name"
              placeholder="أدخل اسم الموظف"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">المسمى الوظيفي *</Label>
            <Select value={position} onValueChange={(value) => setPosition(value as any)}>
              <SelectTrigger id="position">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مشرف">مشرف</SelectItem>
                <SelectItem value="م/مشرف">م/مشرف</SelectItem>
                <SelectItem value="فرد">فرد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="البريد الإلكتروني (اختياري)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              placeholder="رقم الهاتف (اختياري)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              إضافة الموظف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
