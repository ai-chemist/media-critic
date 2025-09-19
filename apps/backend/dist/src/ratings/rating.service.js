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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let RatingsService = class RatingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAggregate(mediaId) {
        const [{ _avg, _count }] = await this.prisma.$transaction([
            this.prisma.userRating.aggregate({
                where: { mediaId },
                _avg: { score: true },
                _count: { _all: true },
            }),
        ]);
        return { average: _avg.score ?? 0, count: _count._all };
    }
    async findAll(query) {
        const { skip = 0, take = 30, search, orderBy = 'mediaId', order = 'desc', withUser = false, } = query;
        const ORDER_BY_WHITELIST = {
            id: true,
            createdAt: true,
            score: true,
            mediaId: true,
            userId: true,
        };
        if (!ORDER_BY_WHITELIST[orderBy]) {
            throw new common_1.BadRequestException('Invalid OrderBy');
        }
        const where = search
            ? isFinite(Number(search))
                ? {
                    OR: [
                        { comment: { contains: String(search), mode: 'insensitive' } },
                        { score: { equals: Number(search) } },
                    ],
                } : { comment: { contains: String(search), mode: 'insensitive' } }
            : undefined;
        return this.prisma.userRating.findMany({
            skip,
            take,
            where,
            orderBy: { [orderBy]: order },
            ...(withUser && {
                select: {
                    id: true,
                    score: true,
                    comment: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            })
        });
    }
    async findOne(id) {
        const rating = await this.prisma.userRating.findFirst({ where: { id } });
        if (!rating)
            throw new common_1.NotFoundException('Rating Record Not found');
        return rating;
    }
    async createFromUser(userId, dto) {
        const media = await this.prisma.media.findUnique({ where: { id: dto.mediaId } });
        if (!media)
            throw new common_1.NotFoundException('Media Record Not found');
        try {
            return await this.prisma.userRating.create({
                data: {
                    userId,
                    mediaId: dto.mediaId,
                    score: dto.score,
                    comment: dto.comment,
                },
            });
        }
        catch (err) {
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code == 'P2002') {
                throw new common_1.ConflictException('Your Rating already exists');
            }
            throw err;
        }
    }
    async updateFromUser(userId, id, dto) {
        const rating = await this.prisma.userRating.findUnique({ where: { id } });
        if (!rating)
            throw new common_1.NotFoundException('Rating Record Not found');
        if (rating.userId !== userId)
            throw new common_1.ForbiddenException('You are not the owner of this rating');
        return this.prisma.userRating.update({
            where: { id },
            data: dto,
        });
    }
    async removeFromUser(userId, id) {
        const rating = await this.prisma.userRating.findUnique({ where: { id } });
        if (!rating)
            throw new common_1.NotFoundException('Rating Not Found');
        if (rating.userId !== userId)
            throw new common_1.ForbiddenException('You are not the owner of this rating');
        return this.prisma.userRating.delete({ where: { id } });
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RatingsService);
//# sourceMappingURL=rating.service.js.map