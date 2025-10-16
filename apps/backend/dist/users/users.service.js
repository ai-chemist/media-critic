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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const refresh_token_service_1 = require("../auth/refresh-token.service");
const library_1 = require("@prisma/client/runtime/library");
let UsersService = class UsersService {
    prisma;
    refreshToken;
    constructor(prisma, refreshToken) {
        this.prisma = prisma;
        this.refreshToken = refreshToken;
    }
    toProfile(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            tag: user.tag,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, tag: true, imageUrl: true, createdAt: true },
        });
        if (!user)
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        return this.toProfile(user);
    }
    async updateUser(userId, dto) {
        try {
            const updated = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    ...(dto.name !== undefined ? { name: dto.name } : {}),
                    ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
                },
                select: { id: true, email: true, name: true, tag: true, imageUrl: true, createdAt: true },
            });
            return this.toProfile(updated);
        }
        catch (err) {
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new common_1.ConflictException('이미 존재하는 조합입니다.');
            }
            throw err;
        }
    }
    async deleteUser(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                tag: true,
                deleted: true,
            }
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        refresh_token_service_1.RefreshTokenService])
], UsersService);
//# sourceMappingURL=users.service.js.map