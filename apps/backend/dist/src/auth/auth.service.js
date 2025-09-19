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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const argon = __importStar(require("argon2"));
const ms_1 = __importDefault(require("ms"));
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    sign(payload) {
        return this.jwt.sign(payload);
    }
    async signAccessToken(payload) {
        return await this.jwt.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '30m',
        });
    }
    async signRefreshToken(payload) {
        return await this.jwt.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '3d',
        });
    }
    async createRefreshSession(userId, refreshToken) {
        const hash = await argon.hash(refreshToken);
        const expMs = (0, ms_1.default)(process.env.JWT_REFRESH_EXPIRES_IN ?? '3d');
        const expiresAt = new Date(Date.now() + expMs);
        await this.prisma.refreshSession.create({
            data: { userId, tokenHash: hash, expiresAt },
        });
    }
    async findMatchedSession(userId, token) {
        const sessions = await this.prisma.refreshSession.findMany({
            where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
            orderBy: { id: 'desc' },
            take: 10,
            select: { id: true, tokenHash: true },
        });
        for (const s of sessions) {
            if (await argon.verify(s.tokenHash, token))
                return { id: s.id };
        }
        return null;
    }
    async signup(dto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });
        if (exists)
            throw new common_1.ConflictException('User already exists');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: { email: dto.email, name: dto.username, passwordHash },
            select: { id: true, email: true, name: true },
        });
        return { user, token: this.sign({ sub: user.id, email: user.email }) };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid email or password');
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid email or password');
        const payload = { sub: user.id, role: 'user' };
        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken(payload),
            this.signRefreshToken(payload),
        ]);
        await this.createRefreshSession(user.id, refreshToken);
        const { passwordHash, ...safe } = user;
        return { user: safe, accessToken, refreshToken };
    }
    async refresh(current) {
        let decoded;
        try {
            decoded = await this.jwt.verifyAsync(current, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const matched = await this.findMatchedSession(decoded.sub, current);
        if (!matched) {
            await this.prisma.refreshSession.updateMany({
                where: { userId: decoded.sub, revokedAt: null },
                data: { revokedAt: new Date() },
            });
            throw new common_1.ForbiddenException('Refresh token reuse detected');
        }
        await this.prisma.refreshSession.update({
            where: { id: matched.id },
            data: { revokedAt: new Date() },
        });
        const payload = { sub: decoded.sub, role: 'user' };
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.signAccessToken(payload),
            this.signRefreshToken(payload),
        ]);
        await this.createRefreshSession(decoded.sub, newRefreshToken);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async logout(current) {
        try {
            const decoded = await this.jwt.verifyAsync(current, { secret: process.env.JWT_REFRESH_SECRET });
            const matched = await this.findMatchedSession(decoded.sub, current);
            if (matched) {
                await this.prisma.refreshSession.update({
                    where: { id: matched.id },
                    data: { revokedAt: new Date() },
                });
            }
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to logout');
        }
        return { ok: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map