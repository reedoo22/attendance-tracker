import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddEmployeeDialog } from './AddEmployeeDialog';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export function EmployeeManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');

  const { data: employees, isLoading } = trpc.attendance.getEmployees.useQuery();
  const utils = trpc.useUtils();

  const deleteEmployeeMutation = trpc.attendance.deleteEmployee.useMutation({
    onSuccess: () => {
      toast.success('تم حذف الموظف بنجاح');
      setDeleteConfirmOpen(false);
      setSelectedEmployeeId(null);
      utils.attendance.getEmployees.invalidate();
    },
    onError: (error) => {
      toast.error('خطأ في حذف الموظف: ' + (error?.message || 'حدث خطأ غير متوقع'));
    },
  });

  const handleDeleteClick = (employeeId: number, employeeName: string) => {
    setSelectedEmployeeId(employeeId);
    setSelectedEmployeeName(employeeName);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployeeId) {
      await deleteEmployeeMutation.mutateAsync({ employeeId: selectedEmployeeId });
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'مشرف':
        return 'bg-orange-100 text-orange-800';
      case 'م/مشرف':
        return 'bg-purple-100 text-purple-800';
      case 'فرد':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة الموظفين</CardTitle>
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            إضافة موظف
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>المسمى الوظيفي</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead className="w-20">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees && employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(employee.position)}`}>
                          {employee.position}
                        </span>
                      </TableCell>
                      <TableCell>{employee.email || '-'}</TableCell>
                      <TableCell>{employee.phone || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(employee.id, employee.name)}
                          disabled={deleteEmployeeMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      لا توجد موظفين
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEmployeeDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onEmployeeAdded={() => {
          // Refresh employees list
        }}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الموظف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف الموظف <strong>{selectedEmployeeName}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
            حذف
          </AlertDialogAction>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
