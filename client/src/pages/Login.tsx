import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface LoginProps {
  onEmployeeLogin: () => void;
  onAdminLogin: (password: string) => boolean;
}

export default function Login({ onEmployeeLogin, onAdminLogin }: LoginProps) {
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmployeeLogin = () => {
    onEmployeeLogin();
    toast.success('تم تسجيل الدخول كموظف');
  };

  const handleAdminLogin = async () => {
    setAdminError('');
    setIsLoading(true);

    // Simulate password check (in production, this would be done server-side)
    setTimeout(() => {
      if (adminPassword === 'Rr009988') {
        if (onAdminLogin(adminPassword)) {
          toast.success('تم تسجيل الدخول كمشرف');
          setAdminPassword('');
        }
      } else {
        setAdminError('كلمة المرور غير صحيحة');
        toast.error('كلمة المرور غير صحيحة');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">نظام تتبع الحضور</h1>
          <p className="text-lg text-gray-600">الوردية المسائية</p>
          <p className="text-sm text-gray-500 mt-2">21 يناير - 20 فبراير 2026</p>
        </div>

        {/* Login Cards */}
        <Tabs defaultValue="employee" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="employee" className="text-base">
              دخول موظف
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-base">
              دخول مشرف
            </TabsTrigger>
          </TabsList>

          {/* Employee Login Tab */}
          <TabsContent value="employee">
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-2xl text-green-900">دخول الموظف</CardTitle>
                <CardDescription className="text-green-700">
                  عرض سجل الحضور الخاص بك (مشاهدة فقط)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    يمكنك عرض سجل حضورك الشخصي والإحصائيات الخاصة بك فقط. لا توجد صلاحيات تعديل.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">الصلاحيات المتاحة:</p>
                    <ul className="text-sm text-gray-700 space-y-1 mr-4">
                      <li>✓ عرض سجل الحضور الشخصي</li>
                      <li>✓ عرض الإحصائيات الشهرية</li>
                      <li>✓ عرض الرسوم البيانية</li>
                      <li>✗ تعديل البيانات</li>
                      <li>✗ عرض بيانات الموظفين الآخرين</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleEmployeeLogin}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                  >
                    دخول كموظف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Login Tab */}
          <TabsContent value="admin">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-2xl text-blue-900">دخول المشرف</CardTitle>
                <CardDescription className="text-blue-700">
                  إدارة كاملة لنظام الحضور والموظفين
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Alert className="mb-6 border-blue-200 bg-blue-50">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    أدخل كلمة المرور للوصول إلى صلاحيات المشرف الكاملة.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">الصلاحيات المتاحة:</p>
                    <ul className="text-sm text-gray-700 space-y-1 mr-4">
                      <li>✓ عرض جميع سجلات الحضور</li>
                      <li>✓ تعديل سجلات الحضور</li>
                      <li>✓ إضافة وحذف الموظفين</li>
                      <li>✓ عرض الإحصائيات الشاملة</li>
                      <li>✓ تصدير التقارير</li>
                      <li>✓ إدارة الإجازات</li>
                    </ul>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="أدخل كلمة المرور"
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          setAdminError('');
                        }}
                        onKeyPress={handleKeyPress}
                        className="pr-10 text-lg py-6"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {adminError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {adminError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Login Button */}
                  <Button
                    onClick={handleAdminLogin}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                  >
                    {isLoading ? 'جاري التحقق...' : 'دخول كمشرف'}
                  </Button>

                  {/* Hint for testing */}
                  <div className="text-xs text-gray-500 text-center mt-4 p-3 bg-gray-50 rounded">
                    <p>للاختبار: استخدم كلمة المرور المقررة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2026 نظام تتبع الحضور - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}
