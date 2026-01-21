import type { Express } from 'express';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  checks: {
    database: boolean;
    memory: boolean;
    cpu: boolean;
  };
}

let lastHealthStatus: HealthStatus | null = null;

export function setupMonitoring(app: Express) {
  // مراقبة استهلاك الذاكرة والموارد
  setInterval(() => {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    console.log('[Monitor] Memory Status:', {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsedPercent: `${heapUsedPercent.toFixed(2)}%`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
    });

    // تحذير إذا تجاوز استهلاك الذاكرة 70%
    if (heapUsedPercent > 70) {
      console.warn('⚠️ [Monitor] High memory usage detected! Heap used:', heapUsedPercent.toFixed(2) + '%');
    }

    // تحذير حرج إذا تجاوز 85%
    if (heapUsedPercent > 85) {
      console.error('🚨 [Monitor] Critical memory usage! Forcing garbage collection...');
      if (global.gc) {
        global.gc();
      }
    }
  }, 60000); // كل دقيقة

  // مراقبة الأخطاء غير المعالجة
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[Monitor] Unhandled Rejection:', {
      promise,
      reason,
      timestamp: new Date(),
    });
  });

  process.on('uncaughtException', (error) => {
    console.error('[Monitor] Uncaught Exception:', {
      error,
      timestamp: new Date(),
    });
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (heapUsedPercent > 85) {
      status = 'unhealthy';
    } else if (heapUsedPercent > 70) {
      status = 'degraded';
    }

    lastHealthStatus = {
      status,
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: memUsage,
      checks: {
        database: true, // يمكن إضافة فحص قاعدة البيانات
        memory: heapUsedPercent < 85,
        cpu: true, // يمكن إضافة فحص CPU
      },
    };

    res.status(status === 'healthy' ? 200 : status === 'degraded' ? 202 : 503).json(lastHealthStatus);
  });

  console.log('[Monitor] Monitoring system initialized');
}

export function getHealthStatus(): HealthStatus | null {
  return lastHealthStatus;
}
