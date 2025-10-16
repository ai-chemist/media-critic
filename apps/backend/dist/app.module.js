"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const nestjs_pino_1 = require("nestjs-pino");
const prisma_module_1 = require("./prisma/prisma.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const env_schema_1 = require("./config/env.schema");
const auth_module_1 = require("./auth/auth.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: (raw) => env_schema_1.EnvSchema.parse(raw),
            }),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty', options: { singleLine: true } }
                        : undefined,
                    redact: ['req.headers.authorization', 'req.headers.cookie'],
                },
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_INTERCEPTOR, useClass: logging_interceptor_1.LoggingInterceptor },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map