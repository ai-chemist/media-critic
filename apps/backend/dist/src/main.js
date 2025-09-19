"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const limit = process.env.REQUEST_BODY_LIMIT || '1mb';
    app.use((0, express_1.json)({ limit }));
    app.use((0, express_1.urlencoded)({ extended: true, limit }));
    app.use((0, helmet_1.default)());
    const threshold = Number(process.env.COMPRESSION_THRESHOLD) || 1024;
    app.use((0, compression_1.default)({
        threshold,
        filter: (req, res) => {
            if (req.headers['x-no-transform'] || res.getHeader('Content-Type')?.toString().includes('image')) {
                return false;
            }
            return compression_1.default.filter(req, res);
        },
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') ?? true,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.set('trust proxy', 1);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Media Critic API')
        .setDescription('The Media Critic API description')
        .setVersion('0.1')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map