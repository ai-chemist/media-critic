import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiErrorResponse } from '../errors/api-error.types'

@Catch() // 모든 예외 대상
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        // Http 요청으로 변환
        const ctx = host.switchToHttp();

        // Request, Response 추출
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        // HttpException 여부 검사
        const isHttpException = exception instanceof HttpException;
        // Status 없을 시 500 INTERNAL_SERVER_ERROR 부여
        const status = isHttpException ?
            exception.getStatus() : 500;

        const message = isHttpException ?
            (exception.getResponse() as any)?.message ?? exception.message : 'INTERNAL_SERVER_ERROR';

        // 설계서에 작성된 형태에 따라 변환
        const resBody: ApiErrorResponse = {
            'success': false,
            'error': {
                'code': (isHttpException && (res as any)?.code || 'INTERNAL_SERVER_ERROR'),
                'reason': message,
                'status': status,
                'details': (isHttpException && (res as any)?.details) || undefined,
            },
            'requestId': (req as any).id ?? '',
            'path': req.url,
            'method': req.method,
            'timestamp': new Date().toISOString(),
        }
        res.status(status).json(resBody);
    }
}