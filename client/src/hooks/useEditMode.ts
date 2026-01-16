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

  const [pendingChanges, setPendingChanges] = useState<Map<string, any>>(new Map());

  // Update mutation
  const updateMutation = trpc.attendance.updateRecord.useMutation({
    onSuccess: () => {
      toast.success('تم حفظ التعديل بنجاح');
      setEditState(prev => ({
        ...prev,
        lastSyncTime: new Date(),
      }));
    },
    onError: (error) => {
      toast.error('خطأ في حفظ التعديل');
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
  const trackChange = useCallback((key: string, value: any) => {
    setPendingChanges(prev => {
      const newMap = new Map(prev);
      newMap.set(key, value);
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
      for (const [key, value] of entries) {
        const [employeeId, dateStr, status] = key.split('|');
        await updateMutation.mutateAsync({
          employeeId: parseInt(employeeId),
          attendanceDate: dateStr,
          status: status as any,
        });
      }

      // Clear pending changes
      setPendingChanges(new Map());
      setEditState(prev => ({
        ...prev,
        isSaving: false,
        hasChanges: false,
        lastSyncTime: new Date(),
      }));

      toast.success(`تم حفظ ${pendingChanges.size} تعديل بنجاح`);
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
