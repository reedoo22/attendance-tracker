import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface PendingChange {
  employeeId: number;
  dateStr: string;
  status: string;
}

interface AutoSaveConfig {
  debounceMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  enableLogging?: boolean;
}

export function useAutoSaveOptimized(
  pendingChanges: Map<string, PendingChange>,
  isEditing: boolean,
  onSaveComplete?: () => void,
  config: AutoSaveConfig = {}
) {
  const {
    debounceMs = 3000,
    maxRetries = 3,
    retryDelayMs = 2000,
    enableLogging = true,
  } = config;

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const retryCountRef = useRef(0);
  const utils = trpc.useUtils();
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  const updateMutation = trpc.attendance.updateRecord.useMutation({
    onSuccess: () => {
      utils.attendance.getRecords.invalidate();
    },
    onError: (error) => {
      if (enableLogging) {
        console.error('[AutoSave] Error in mutation:', error);
      }
    },
  });

  const log = useCallback((message: string, data?: any) => {
    if (enableLogging) {
      console.log(`[AutoSave] ${message}`, data || '');
    }
  }, [enableLogging]);

  const performAutoSave = useCallback(async () => {
    if (isSavingRef.current || pendingChanges.size === 0 || !isEditing) {
      return;
    }

    isSavingRef.current = true;
    setAutoSaveStatus('saving');

    try {
      const entries = Array.from(pendingChanges.entries());
      let successCount = 0;
      let errorCount = 0;
      const failedRecords: Array<{ key: string; error: any }> = [];

      log(`Starting auto-save for ${entries.length} changes`);

      for (const [key, value] of entries) {
        try {
          await updateMutation.mutateAsync({
            employeeId: value.employeeId,
            attendanceDate: value.dateStr,
            status: value.status as any,
          });
          successCount++;
          log(`Successfully saved: ${key}`);
        } catch (error) {
          errorCount++;
          failedRecords.push({ key, error });
          log(`Failed to save: ${key}`, error);
        }
      }

      // عرض النتائج
      if (successCount > 0 && errorCount === 0) {
        toast.success(`تم حفظ ${successCount} تعديل تلقائياً`, {
          duration: 2000,
        });
        retryCountRef.current = 0;
        setAutoSaveStatus('idle');
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`تم حفظ ${successCount} تعديل. فشل ${errorCount} تعديل`, {
          duration: 3000,
        });
        setAutoSaveStatus('error');
      } else if (errorCount > 0) {
        throw new Error(`Failed to save ${errorCount} records`);
      }

      onSaveComplete?.();
      } catch (error) {
        log('Auto-save failed', error);

        // إعادة محاولة إذا لم تتجاوز الحد الأقصى
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          log(`Retry attempt ${retryCountRef.current}/${maxRetries}`);

          toast.info(`جاري إعادة محاولة الحفظ (${retryCountRef.current}/${maxRetries})`, {
            duration: 2000,
          });

          // إعادة محاولة بعد تأخير متزايد
          setTimeout(() => {
            isSavingRef.current = false;
            performAutoSave();
          }, retryDelayMs * retryCountRef.current);
        } else {
          toast.error('فشل حفظ البيانات بعد عدة محاولات. يرجى المحاولة يدوياً.', {
            duration: 5000,
          });
          setAutoSaveStatus('error');
          isSavingRef.current = false;
        }
      } finally {
        if (retryCountRef.current >= maxRetries) {
          isSavingRef.current = false;
        }
      }
  }, [pendingChanges, isEditing, updateMutation, onSaveComplete, maxRetries, retryDelayMs, log]);

  // Debounced auto-save
  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    if (pendingChanges.size > 0 && isEditing) {
      log(`Scheduling auto-save in ${debounceMs}ms for ${pendingChanges.size} changes`);

      saveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, debounceMs);
    }

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [pendingChanges, isEditing, debounceMs, performAutoSave, log]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingChanges.size > 0 && isEditing) {
        log('Page unload detected, attempting final save');
        e.preventDefault();
        e.returnValue = '';
        performAutoSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pendingChanges, isEditing, performAutoSave, log]);

  return {
    autoSaveStatus,
    isAutoSaving: isSavingRef.current,
    retryCount: retryCountRef.current,
  };
}
