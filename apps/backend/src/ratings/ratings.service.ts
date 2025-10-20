import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingListQueryDto } from './dto/rating-list.query.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RatingsService {
    constructor(private readonly prisma: PrismaService) {}

    async createRating(userId: number, dto: CreateRatingDto) {
        try {
            return await this.prisma.rating.create({
                data: {
                    userId,
                    mediaId: dto.mediaId,
                    score: dto.score,
                    comment: dto.comment,
                },
            });
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
                // unique(userId, mediaId) 위반 -> 한 사람당 하나의 미디어에 대한 평점은 하나만 존재 가능할 것
                throw new ConflictException('이미 해당 미디어에 대한 평가를 작성하였습니다.');
            }
            throw err;
        }
    }

    async findRating(id: number) {
        const rating = await this.prisma.rating.findUnique({ where: { id } });
        if (!rating) throw new NotFoundException('해당하는 평가를 찾을 수 없습니다.');
        return rating;
    }

    async findRatingList(query: RatingListQueryDto) {
        const where = query.mediaId ? { mediaId: query.mediaId } : {};
        return await this.prisma.rating.findMany({
            where,
            skip: query.skip ?? 0,
            take: query.take ?? 10,
            orderBy: { createdAt: 'desc' },
        });
    }

    // 업데이트 및 삭제 전 소유권 확인
    private async checkOwner(ratingId: number, userId: number) {
        const rating = await this.prisma.rating.findUnique({
            where: { id: ratingId },
            select: { id: true, userId: true },
        });
        if (!rating) throw new NotFoundException('해당하는 평가를 찾을 수 없습니다.');
        if (rating.userId !== userId) throw new ForbiddenException('수정/삭제에 대한 권한이 없는 사용자입니다.');
    }

    async updateRating(ratingId: number, userId: number, dto: UpdateRatingDto) {
        await this.checkOwner(ratingId, userId);
        return this.prisma.rating.update({
            where: { id: ratingId },
            data: { ...dto },
        });
    }

    async removeRating(ratingId: number, userId: number) {
        await this.checkOwner(ratingId, userId);
        return this.prisma.rating.delete({ where: { id: ratingId } });
    }

    // TODO: 아래 메서드는 임시로 사용할 집계 메서드
    async aggregateRating(mediaId: number) {
        const [count, avg] = await this.prisma.$transaction([
            this.prisma.rating.count({ where: { mediaId } }),
            this.prisma.rating.aggregate({
                _avg: { score: true },
                where: { mediaId },
            }),
        ]);
        return { mediaId, count, avgScore: avg._avg.score ?? 0 };
    }
}