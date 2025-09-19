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
const throttler_1 = require("@nestjs/throttler");
const request_id_middleware_1 = require("./common/middlewares/request-id.middleware");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const media_module_1 = require("./media/media.module");
const ratings_module_1 = require("./ratings/ratings.module");
const auth_module_1 = require("./auth/auth.module");
const health_controller_1 = require("./health.controller");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_id_middleware_1.RequestIdMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: Number(process.env.RATE_TTL) ?? 60,
                    limit: Number(process.env.RATE_LIMIT) ?? 10,
                },
            ]),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            media_module_1.MediaModule,
            ratings_module_1.RatingsModule,
            auth_module_1.AuthModule
        ],
        controllers: [
            app_controller_1.AppController,
            health_controller_1.HealthController,
        ],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_INTERCEPTOR, useClass: logging_interceptor_1.LoggingInterceptor },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map