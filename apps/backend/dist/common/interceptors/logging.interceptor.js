"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const rxjs_1 = require("rxjs");
let LoggingInterceptor = class LoggingInterceptor {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    intercept(ctx, next) {
        const started = Date.now();
        const req = ctx.switchToHttp().getRequest();
        const res = ctx.switchToHttp().getResponse();
        const method = req?.method;
        const path = req?.originalUrl ?? req?.url;
        const requestId = req?.id;
        return next.handle().pipe((0, rxjs_1.tap)(() => {
            const ms = Date.now() - started;
            this.logger.log({
                'message': 'handler_done',
                'method': method,
                'path': path,
                'status': res?.statusCode,
                'ms': ms,
                'requestId': requestId
            });
        }), (0, rxjs_1.catchError)((err) => {
            const ms = Date.now() - started;
            this.logger.error({
                'message': 'handler_error',
                'method': 'method',
                'path': path,
                'status': res?.statusCode,
                'ms': ms,
                'requestId': requestId,
                'error': err?.message,
            }, err);
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_pino_1.Logger])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map