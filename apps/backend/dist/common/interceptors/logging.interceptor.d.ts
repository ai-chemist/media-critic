import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Observable } from 'rxjs';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logger;
    constructor(logger: Logger);
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any>;
}
