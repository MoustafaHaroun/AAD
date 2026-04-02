import { Global, Module } from '@nestjs/common';
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import {
  HTTP_REQUEST_DURATION,
  HTTP_REQUEST_TOTAL,
  HttpMetricsInterceptor,
} from '@/infrastructure/monitoring/http-metrics.interceptor';
import { AppLogger } from '@/infrastructure/monitoring/logger.service';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  providers: [
    AppLogger,
    HttpMetricsInterceptor,
    makeCounterProvider({
      name: HTTP_REQUEST_TOTAL,
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    }),
    makeHistogramProvider({
      name: HTTP_REQUEST_DURATION,
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    }),
  ],
  exports: [AppLogger, HttpMetricsInterceptor],
})
export class MetricsModule {}
