import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {  // NestInterceptor: NestJS에서 제공하는 Interceptor 훅
    constructor(private readonly logger: Logger) {}

    // ExecutionContext: 현재 실행 컨텍스트 정보(Http or gRPC 등)
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const started = Date.now();
        // Http 요청 응답 객체 추출
        const req = ctx.switchToHttp().getRequest() as any;
        const res = ctx.switchToHttp().getResponse() as any;

        const method = req?.method;
        const path = req?.originalUrl ?? req?.url;
        const requestId = req?.id;  // pino가 부여한 req.id TODO: 반드시 생성되는 옵션일 경우 옵셔널 지울 것

        // 컨트롤러 반환의 Observable 스트림에 next()로 연산자 연결
        return next.handle().pipe(
            tap(() => {
                const ms = Date.now() - started;
                this.logger.log({
                    'message': 'handler_done',
                    'method': method,
                    'path': path,
                    'status': res?.statusCode,
                    'ms': ms,
                    'requestId': requestId
                });
            }),
            catchError((err) => {
                const ms = Date.now() - started;
                this.logger.error(
                    {
                        'message': 'handler_error',
                        'method': 'method',
                        'path': path,
                        'status': res?.statusCode,
                        'ms': ms,
                        'requestId': requestId,
                        'error': err?.message,
                    },
                    err,
                );
                return throwError(() => err);
            }),
        );
    }
}