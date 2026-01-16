import { Button } from '@/components/ui/button';
import { Edit2, Save, X, Check, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface EditModeToolbarProps {
  isEditing: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  lastSyncTime: Date | null;
  pendingChangesCount: number;
  onEnableEdit: () => void;
  onDisableEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditModeToolbar({
  isEditing,
  hasChanges,
  isSaving,
  lastSyncTime,
  pendingChangesCount,
  onEnableEdit,
  onDisableEdit,
  onSave,
  onCancel,
}: EditModeToolbarProps) {
  if (!isEditing) {
    return (
      <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              جميع البيانات محفوظة
            </span>
            {lastSyncTime && (
              <span className="text-xs text-gray-500">
                آخر مزامنة: {format(lastSyncTime, 'HH:mm:ss', { locale: ar })}
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={onEnableEdit}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Edit2 className="w-4 h-4" />
          تعديل البيانات
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-300 sticky top-20 z-40">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-amber-900">
            وضع التعديل مفعّل
          </span>
          {pendingChangesCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 bg-amber-200 text-amber-900 px-2 py-1 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3" />
              {pendingChangesCount} تعديل معلق
            </span>
          )}
        </div>
        {hasChanges && (
          <p className="text-xs text-amber-700 mt-1">
            لديك تعديلات غير محفوظة. انقر على "حفظ" لحفظ جميع التعديلات
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onCancel}
          variant="outline"
          className="gap-2 border-amber-300 hover:bg-amber-100"
          disabled={isSaving}
        >
          <X className="w-4 h-4" />
          إلغاء
        </Button>

        <Button
          onClick={onSave}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              حفظ التعديلات
            </>
          )}
        </Button>

        <Button
          onClick={onDisableEdit}
          variant="outline"
          className="gap-2 border-amber-300 hover:bg-amber-100"
          disabled={isSaving}
        >
          <X className="w-4 h-4" />
          إغلاق التعديل
        </Button>
      </div>
    </div>
  );
}
