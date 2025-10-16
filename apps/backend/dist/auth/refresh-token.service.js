"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let RefreshTokenService = class RefreshTokenService {
    jwt;
    prisma;
    config;
    cookieName;
    refreshSecret;
    refreshExpires;
    constructor(jwt, prisma, config) {
        this.jwt = jwt;
        this.prisma = prisma;
        this.config = config;
        this.cookieName = this.config.get('JWT_REFRESH_COOKIE_NAME') ?? 'rt';
        this.refreshSecret = this.config.get('JWT_REFRESH_SECRET');
        this.refreshExpires = this.config.get('JWT_REFRESH_EXPIRES', '7d');
    }
    getCookieName() {
        return this.cookieName;
    }
    cookieOptions() {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.COOKIE_DOMAIN || undefined,
            path: '/api/auth/refresh',
        };
    }
    async issueRefreshToken(userId, userAgent, ip) {
        const refreshToken = await this.jwt.signAsync({ sub: userId, typ: 'refresh' }, { secret: this.refreshSecret, expiresIn: this.refreshExpires });
        const tokenHash = await argon2.hash(refreshToken, { type: argon2.argon2id });
        const expiresAt = new Date(Date.now() + this.parseDurationMs(this.refreshExpires));
        await this.prisma.refreshToken.create({
            data: { userId, tokenHash, userAgent, ip, expiresAt },
        });
        return refreshToken;
    }
    async rotate(oldToken, userAgent, ip) {
        const payload = await this.jwt.verifyAsync(oldToken, { secret: this.refreshSecret });
        const userId = payload.sub;
        const rows = await this.prisma.refreshToken.findMany({
            where: { userId, revoked: false, expiresAt: { gt: new Date() } },
            select: { id: true, tokenHash: true },
        });
        const matched = await this.findMatch(rows, oldToken);
        if (!matched) {
            await this.prisma.refreshToken.updateMany({
                where: { userId, revoked: false },
                data: { revoked: true },
            });
            throw new Error('Refresh token reuse detected');
        }
        await this.prisma.refreshToken.update({
            where: { id: matched.id },
            data: { revoked: true },
        });
        const newToken = await this.issueRefreshToken(userId, userAgent, ip);
        return { userId, newToken };
    }
    async revokeAll(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true },
        });
    }
    async findMatch(rows, token) {
        for (const row of rows) {
            if (await argon2.verify(row.tokenHash, token))
                return row;
        }
        return null;
    }
    parseDurationMs(input) {
        const match = /^(\d+)([smhd])$/.exec(input);
        if (!match)
            throw new Error('Invalid duration format');
        const num = Number(match[1]);
        switch (match[2]) {
            case 's': return num * 1e3;
            case 'm': return num * 6e4;
            case 'h': return num * 36e5;
            default: return num * 864e5;
        }
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map