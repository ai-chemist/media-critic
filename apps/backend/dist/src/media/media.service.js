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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const orm_exception_1 = require("../common/orm-exception");
const library_1 = require("@prisma/client/runtime/library");
let MediaService = class MediaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { skip = 0, take = 30, search, year, type, orderBy = 'year', order = 'desc', } = query;
        const where = search ? {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { type: { contains: search, mode: 'insensitive' } },
            ],
        } : undefined;
        return this.prisma.media.findMany({
            skip,
            take,
            where,
            orderBy: { [orderBy]: order },
        });
    }
    async findOne(id) {
        const media = await this.prisma.media.findFirst({ where: { id } });
        if (!media)
            throw new common_1.NotFoundException('Media Record Not found');
        return media;
    }
    async create(dto) {
        try {
            return await this.prisma.media.create({ data: dto });
        }
        catch (err) {
            return (0, orm_exception_1.mapOrmError)(err);
        }
    }
    async update(id, dto) {
        try {
            return await this.prisma.media.update({ where: { id }, data: dto });
        }
        catch (err) {
            return (0, orm_exception_1.mapOrmError)(err);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.media.delete({ where: { id } });
        }
        catch (err) {
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code == 'P2025') {
                throw new common_1.NotFoundException('Media Record Not found');
            }
            throw err;
        }
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map