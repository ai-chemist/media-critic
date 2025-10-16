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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const password_services_1 = require("./password.services");
const refresh_token_service_1 = require("./refresh-token.service");
let AuthService = class AuthService {
    jwt;
    password;
    refreshToken;
    constructor(jwt, password, refreshToken) {
        this.jwt = jwt;
        this.password = password;
        this.refreshToken = refreshToken;
    }
    async register(dto, userAgent, ip) {
        const user = await this.users.createUser(dto);
        const accessToken = await this.jwt.signAsync({ sub: user.id });
        const refreshToken = await this.refreshToken.issueRefreshToken(user.id, userAgent, ip);
        return { user, tokens: { accessToken, refreshToken } };
    }
    async loginByEmail(email, password, userAgent, ip) {
        const user = await this.users.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
        const ok = await this.password.verify(user.passwordHash, password);
        if (!ok)
            throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
        const accessToken = await this.jwt.signAsync({ sub: user.id });
        const refreshToken = await this.refreshToken.issueRefreshToken(user.id, userAgent, ip);
        return {
            user: { id: user.id, email: user.email, name: user.name, tag: user.tag },
            tokens: { accessToken, refreshToken },
        };
    }
    async refresh(oldToken, userAgent, ip) {
        const { userId, newToken } = await this.refreshToken.rotate(oldToken, userAgent, ip);
        const accessToken = await this.jwt.signAsync({ sub: userId });
        return { accessToken, refreshToken: newToken };
    }
    async logoutAll(userId) {
        await this.refreshToken.revokeAll(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        password_services_1.PasswordService,
        refresh_token_service_1.RefreshTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map