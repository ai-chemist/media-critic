// 모든 에러를 json 형식으로 파싱

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();

        const reqId = req.requestId ?? '-';
        const method = req.method;
        const path = req.originalUrl || req.url;
        const timestamp = new Date().toISOString();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let code = 'INTERNAL_SERVER_ERROR';
        let message = 'Unexcepted Error';
        let details: any = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const resp = exception.getResponse();
            if (typeof resp === 'string') {
                message = resp;
            } else if (resp && typeof resp == 'object') {
                const r: any = resp;
                message = r.message ?? r.error ?? message;
                code = (r.error as string) ?? code;

                // class-validation 형식 대응
                if (Array.isArray(r.message)) {
                    details = r.message.map((m: any) => (typeof m === 'string' ? { message: m }: m));

                }
            }
        }

        // TODO: Prisma 오류 매핑

        // class-validator 에러 배열이 raw 형태로 들어온 경우
        if (Array.isArray(exception) && exception[0] instanceof ValidationError) {
            status = HttpStatus.BAD_REQUEST;
            code = 'BAD_REQUEST';
            message = 'Validation Error';
            details = exception.map((err: ValidationError) => ({
                field: err.property,
                constrains: err.constraints,
            }));
        }

        res.status(status).json({
            reqId, status, code, message, details, method, path, timestamp,
        });
    }
}