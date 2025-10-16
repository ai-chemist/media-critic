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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../common/decorators/public.decorator");
const auth_service_1 = require("./auth.service");
const refresh_token_service_1 = require("./refresh-token.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
let AuthController = class AuthController {
    authService;
    refreshToken;
    constructor(authService, refreshToken) {
        this.authService = authService;
        this.refreshToken = refreshToken;
    }
    async register(dto, req, res) {
        const userAgent = req.get('user-agent') ?? undefined;
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
        const out = await this.authService.register(dto, userAgent, ip);
        res.cookie(this.refreshToken.getCookieName(), out.tokens.refreshToken, this.refreshToken.cookieOptions());
        return { user: out.user, tokens: { accessToken: out.tokens.accessToken } };
    }
    async login(dto, req, res) {
        const userAgent = req.get('user-agent') ?? undefined;
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
        const out = await this.authService.loginByEmail(dto.email, dto.password, userAgent, ip);
        res.cookie(this.refreshToken.getCookieName(), out.tokens.refreshToken, this.refreshToken.cookieOptions());
        return { user: out.user, tokens: { accessToken: out.tokens.accessToken } };
    }
    async refresh(req, res) {
        const old = req.cookies?.[this.refreshToken.getCookieName()];
        if (!old)
            throw new Error('No Refresh Token');
        const userAgent = req.get('user-agent') ?? undefined;
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
        const { accessToken, refreshToken } = await this.authService.refresh(old, userAgent, ip);
        res.cookie(this.refreshToken.getCookieName(), refreshToken, this.refreshToken.cookieOptions());
        return { tokens: { accessToken } };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        refresh_token_service_1.RefreshTokenService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map