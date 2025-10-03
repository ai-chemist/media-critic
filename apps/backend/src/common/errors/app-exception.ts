import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum';

type AppExceptionInit = {
    code: ErrorCode;
    message: string;
    status?: HttpStatus;  // default: 400
    details?: Record<string, unknown>;
    cause?: unknown;  // 로그 보관용
};

export class AppException extends HttpException {
    public readonly code: ErrorCode;
    public readonly details?: Record<string, unknown>;

    constructor({ code, message, status = HttpStatus.BAD_REQUEST, details, cause }: AppExceptionInit) {
        super({ code, message, status, details }, status, { cause });
        this.code = code;
        this.details = details;
    }
}