import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum';

type AppExceptionInit = {
    code: ErrorCode;
    message: string;
    status?: number;  // default: 400
    details?: Record<string, unknown>;
};

export class AppException extends HttpException {
    public readonly code: ErrorCode;
    public readonly details?: Record<string, unknown>;

    constructor({ code, message, status = HttpStatus.BAD_REQUEST, details }: AppExceptionInit) {
        super({ code, message, status, details }, status );
        this.code = code;
        this.details = details;
    }
}