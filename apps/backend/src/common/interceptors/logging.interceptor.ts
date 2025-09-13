import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const req = ctx.switchToHttp().getRequest();
        const { method, originalUrl } = req;
        const reqId = req.requestId ?? '-';
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                const res = ctx.switchToHttp().getResponse();
                const status = res.statusCode;
                const ms = Date.now() - start;

                // 최소 필드만 로깅
                this.logger.log(`${method} ${originalUrl} ${status} ${ms}ms reqId=${reqId}`);
            })
        )
    }
}