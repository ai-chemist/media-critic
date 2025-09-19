"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const reqId = req.requestId ?? '-';
        const method = req.method;
        const path = req.originalUrl || req.url;
        const timestamp = new Date().toISOString();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let code = 'INTERNAL_SERVER_ERROR';
        let message = 'Unexcepted Error';
        let details = undefined;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const resp = exception.getResponse();
            if (typeof resp === 'string') {
                message = resp;
            }
            else if (resp && typeof resp == 'object') {
                const r = resp;
                message = r.message ?? r.error ?? message;
                code = r.error ?? code;
                if (Array.isArray(r.message)) {
                    details = r.message.map((m) => (typeof m === 'string' ? { message: m } : m));
                }
            }
        }
        if (Array.isArray(exception) && exception[0] instanceof class_validator_1.ValidationError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            code = 'BAD_REQUEST';
            message = 'Validation Error';
            details = exception.map((err) => ({
                field: err.property,
                constrains: err.constraints,
            }));
        }
        res.status(status).json({
            reqId, status, code, message, details, method, path, timestamp,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map