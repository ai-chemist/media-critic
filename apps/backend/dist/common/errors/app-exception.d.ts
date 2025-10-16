import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum';
type AppExceptionInit = {
    code: ErrorCode;
    message: string;
    status?: HttpStatus;
    details?: Record<string, unknown>;
    cause?: unknown;
};
export declare class AppException extends HttpException {
    readonly code: ErrorCode;
    readonly details?: Record<string, unknown>;
    constructor({ code, message, status, details, cause }: AppExceptionInit);
}
export {};
