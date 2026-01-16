import { useState, useMemo } from 'react';
import { useLogin } from '@/contexts/LoginContext';
import { AttendanceTable } from '@/components/AttendanceTable';
import { EmployeeStats } from '@/components/EmployeeStats';
import { Legend } from '@/components/Legend';
import { EmployeeGrid } from '@/components/EmployeeGrid';
import { AttendanceChart } from '@/components/AttendanceChart';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { EMPLOYEES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Download, Upload, RotateCcw, LogOut, Shield, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Home() {
  const { role, logout, canEdit, canViewAll } = useLogin();

  const {
    attendance,
    dates,
    updateAttendance,
    getDailyCount,
    getTotalStats,
    exportToJSON,
    importFromJSON
  } = useAttendanceData();

  // Calculate daily counts
  const dailyCounts = useMemo(() => {
    const counts: { [dateStr: string]: number } = {};
    dates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      counts[dateStr] = getDailyCount(dateStr, 'P');
    });
    return counts;
  }, [dates, getDailyCount]);

  // Get total stats
  const totalStats = useMemo(() => getTotalStats(), [getTotalStats]);

  // Get employee stats function
  const getEmployeeStats = (empId: number) => {
    const empAttendance = attendance[empId] || {};
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      early: 0,
      violation: 0,
      annualLeave: 0,
      sickLeave: 0,
      emergencyLeave: 0,
      unpaidLeave: 0,
      dayOff: 0,
      holiday: 0
    };
    Object.values(empAttendance).forEach(code => {
      switch (code) {
        case 'P': stats.present++; break;
        case 'A': stats.absent++; break;
        case 'L': stats.late++; break;
        case 'E': stats.early++; break;
        case 'V': stats.violation++; break;
        case 'AL': stats.annualLeave++; break;
        case 'S/L': stats.sickLeave++; break;
        case 'E/L': stats.emergencyLeave++; break;
        case 'U/L': stats.unpaidLeave++; break;
        case 'D/O': stats.dayOff++; break;
        case 'OFF': stats.holiday++; break;
      }
    });
    return stats;
  };

  // Export handler
  const handleExport = () => {
    const json = exportToJSON();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
    element.setAttribute('download', `attendance_${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('تم تصدير البيانات بنجاح');
  };

  // Import handler
  const handleImport = () => {
    if (!canEdit) {
      toast.error('ليس لديك صلاحية لاستيراد البيانات');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const success = importFromJSON(event.target.result);
        if (success) {
          toast.success('تم استيراد البيانات بنجاح');
        } else {
          toast.error('خطأ في استيراد البيانات');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Reset handler
  const handleReset = () => {
    if (!canEdit) {
      toast.error('ليس لديك صلاحية لإعادة تعيين البيانات');
      return;
    }
    if (confirm('هل أنت متأكد من رغبتك في إعادة تعيين جميع البيانات؟')) {
      window.location.reload();
      toast.success('تم إعادة تعيين البيانات');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const getRoleBadge = () => {
    if (role === 'admin') {
      return (
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          مشرف
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <User className="w-4 h-4" />
          موظف
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">نظام تتبع الحضور</h1>
              <p className="text-gray-600 text-sm mt-1">الوردية المسائية | 21 يناير - 20 فبراير 2026</p>
            </div>
            <div className="flex gap-2 items-center">
              {getRoleBadge()}
              {canEdit && (
                <>
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    تصدير
                  </Button>
                  <Button
                    onClick={handleImport}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    استيراد
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    إعادة تعيين
                  </Button>
                </>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Permission Alert for Employees */}
      {role === 'employee' && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="border-green-200 bg-green-50">
            <User className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              أنت في وضع المشاهدة فقط. يمكنك عرض سجل حضورك الشخصي والإحصائيات الخاصة بك فقط.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-6">
            <TabsTrigger value="table">جدول الحضور</TabsTrigger>
            <TabsTrigger value="employees">الموظفون</TabsTrigger>
            <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
            <TabsTrigger value="charts">الرسوم البيانية</TabsTrigger>
            <TabsTrigger value="legend">المفاتيح</TabsTrigger>
          </TabsList>

          {/* Attendance Table Tab */}
          <TabsContent value="table" className="space-y-4">
            <AttendanceTable
              dates={dates}
              attendance={attendance}
              onAttendanceChange={canEdit ? updateAttendance : () => {}}
              dailyCounts={dailyCounts}
              readOnly={!canEdit}
            />
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4">
            {canViewAll ? (
              <EmployeeGrid
                attendance={attendance}
                getEmployeeStats={getEmployeeStats}
              />
            ) : (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  الموظفون لا يمكنهم عرض بيانات الموظفين الآخرين. هذه الميزة متاحة للمشرفين فقط.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-4">
            <EmployeeStats
              stats={totalStats}
              totalEmployees={EMPLOYEES.length}
            />
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-4">
            <AttendanceChart stats={totalStats} />
          </TabsContent>

          {/* Legend Tab */}
          <TabsContent value="legend" className="space-y-4">
            <Legend />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>نظام تتبع الحضور للوردية المسائية © 2026</p>
          <p className="mt-1">جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
