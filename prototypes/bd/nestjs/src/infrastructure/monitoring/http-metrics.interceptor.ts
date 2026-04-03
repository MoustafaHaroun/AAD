import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

export const HTTP_REQUEST_TOTAL = 'http_requests_total';
export const HTTP_REQUEST_DURATION = 'http_request_duration_seconds';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric(HTTP_REQUEST_TOTAL)
    private readonly requestCounter: Counter<string>,
    @InjectMetric(HTTP_REQUEST_DURATION)
    private readonly requestDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method } = request;
    const path =
      (request.route as { path?: string } | undefined)?.path ?? request.path;
    const endTimer = this.requestDuration.startTimer({ method, path });

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const status: string = String(response.statusCode);
        this.requestCounter.inc({ method, path, status });
        endTimer({ status });
      }),
    );
  }
}
