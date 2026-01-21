import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface PendingChange {
  employeeId: number;
  dateStr: string;
  status: string;
}

export function useAutoSave(
  pendingChanges: Map<string, PendingChange>,
  isEditing: boolean,
  onSaveComplete?: () => void
) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const utils = trpc.useUtils();

  const updateMutation = trpc.attendance.updateRecord.useMutation({
    onSuccess: () => {
      utils.attendance.getRecords.invalidate();
    },
    onError: (error) => {
      console.error('Error in auto-save:', error);
    },
  });

  const performAutoSave = useCallback(async () => {
    if (isSavingRef.current || pendingChanges.size === 0 || !isEditing) {
      return;
    }

    isSavingRef.current = true;

    try {
      const entries = Array.from(pendingChanges.entries());
      let successCount = 0;
      let errorCount = 0;

      for (const [, value] of entries) {
        try {
          await updateMutation.mutateAsync({
            employeeId: value.employeeId,
            attendanceDate: value.dateStr,
            status: value.status as any,
          });
          successCount++;
        } catch (error) {
          console.error(`Error auto-saving record:`, error);
          errorCount++;
        }
      }

      if (successCount > 0 && errorCount === 0) {
        toast.success(`تم حفظ ${successCount} تعديل تلقائياً`, {
          duration: 2000,
        });
      }

      onSaveComplete?.();
    } catch (error) {
      console.error('Error during auto-save:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [pendingChanges, isEditing, updateMutation, onSaveComplete]);

  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (3 seconds after last change)
    if (pendingChanges.size > 0 && isEditing) {
      saveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, 3000);
    }

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [pendingChanges, isEditing, performAutoSave]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingChanges.size > 0) {
        e.preventDefault();
        e.returnValue = '';
        performAutoSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pendingChanges, performAutoSave]);
}
