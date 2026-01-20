import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface EditState {
  isEditing: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  lastSyncTime: Date | null;
}

export function useEditMode() {
  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    hasChanges: false,
    isSaving: false,
    lastSyncTime: null,
  });

  const [pendingChanges, setPendingChanges] = useState<Map<string, { employeeId: number; dateStr: string; status: string }>>(new Map());
  const utils = trpc.useUtils();

  // Update mutation
  const updateMutation = trpc.attendance.updateRecord.useMutation({
    onSuccess: () => {
      // Invalidate queries to refresh data
      utils.attendance.getRecords.invalidate();
    },
    onError: (error) => {
      toast.error('خطأ في حفظ التعديل: ' + (error?.message || 'حدث خطأ غير متوقع'));
      console.error('Error saving changes:', error);
    },
  });

  // Enable edit mode
  const enableEditMode = useCallback(() => {
    setEditState(prev => ({
      ...prev,
      isEditing: true,
      hasChanges: false,
    }));
    toast.info('تم تفعيل وضع التعديل');
  }, []);

  // Disable edit mode
  const disableEditMode = useCallback(() => {
    if (editState.hasChanges) {
      const confirmed = window.confirm('هناك تعديلات لم تُحفظ. هل تريد المتابعة؟');
      if (!confirmed) return;
    }
    setEditState(prev => ({
      ...prev,
      isEditing: false,
      hasChanges: false,
    }));
    setPendingChanges(new Map());
    toast.info('تم إغلاق وضع التعديل');
  }, [editState.hasChanges]);

  // Track changes
  const trackChange = useCallback((employeeId: number, dateStr: string, status: string) => {
    const key = `${employeeId}|${dateStr}`;
    setPendingChanges(prev => {
      const newMap = new Map(prev);
      newMap.set(key, { employeeId, dateStr, status });
      return newMap;
    });
    setEditState(prev => ({
      ...prev,
      hasChanges: true,
    }));
  }, []);

  // Save all changes
  const saveAllChanges = useCallback(async () => {
    if (pendingChanges.size === 0) {
      toast.warning('لا توجد تعديلات لحفظها');
      return;
    }

    setEditState(prev => ({
      ...prev,
      isSaving: true,
    }));

    try {
      // Save each change
      const entries = Array.from(pendingChanges.entries());
      let successCount = 0;
      let errorCount = 0;

      for (const [key, value] of entries) {
        try {
          await updateMutation.mutateAsync({
            employeeId: value.employeeId,
            attendanceDate: value.dateStr,
            status: value.status as any,
          });
          successCount++;
        } catch (error) {
          console.error(`Error saving record for ${key}:`, error);
          errorCount++;
        }
      }

      // Clear pending changes
      setPendingChanges(new Map());
      setEditState(prev => ({
        ...prev,
        isSaving: false,
        hasChanges: false,
        lastSyncTime: new Date(),
      }));

      if (errorCount === 0) {
        toast.success(`تم حفظ ${successCount} تعديل بنجاح`);
      } else {
        toast.warning(`تم حفظ ${successCount} تعديل. فشل ${errorCount} تعديل`);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('خطأ في حفظ التعديلات');
      setEditState(prev => ({
        ...prev,
        isSaving: false,
      }));
    }
  }, [pendingChanges, updateMutation]);

  // Cancel changes
  const cancelChanges = useCallback(() => {
    setPendingChanges(new Map());
    setEditState(prev => ({
      ...prev,
      hasChanges: false,
    }));
    toast.info('تم إلغاء التعديلات');
  }, []);

  return {
    editState,
    pendingChanges,
    enableEditMode,
    disableEditMode,
    trackChange,
    saveAllChanges,
    cancelChanges,
  };
}
