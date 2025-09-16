import {
    Injectable,
    ConflictException,
    NotFoundException,
    ForbiddenException,
    BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { Prisma, UserRating } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { FindRatingQueryDto } from './dto/find-rating.query.dto';

export type RatingListItem = {
    id: number;
    score: number;
    comment: string | null;
    createdAt: Date;
    user: { id: number; username: string | null; image_url: string | null };
};

export type RatingAggregate = {
    average: number; count: number;
}

// Rating 부분은 전체적으로 보완해야함 - 메서드 실행 시 프런트 측에서 검증 후 세션이나 토큰 등으로 2차 검증 필요
@Injectable()
export class RatingsService {
    constructor(private readonly prisma: PrismaService) {}

    // 집계 함수
    private async getAggregate(mediaId: number): Promise<RatingAggregate> {
        const [{ _avg, _count }] = await this.prisma.$transaction([
            this.prisma.userRating.aggregate({
                where: { mediaId },
                _avg: { score: true },
                _count: { _all: true },
            }),
        ]);
        return { average: _avg.score ?? 0, count: _count._all };
    }

    async findAll(query: FindRatingQueryDto) {
        const {
            skip = 0,
            take = 30,
            search,
            orderBy = 'mediaId',
            order = 'desc',
            withUser = false,
        } = query;

        // TODO: ORDER_BY_WHITELIST 보다 더 나은 이름 찾기
        // orderBy WHITE_LIST (예상 가능한 컬럼만 사용 허용)
        const ORDER_BY_WHITELIST: Record<string, true> = {
            id: true,
            createdAt: true,
            score: true,
            mediaId: true,
            userId: true,
        };
        if (!ORDER_BY_WHITELIST[orderBy]) {throw new BadRequestException('Invalid OrderBy');}

        // undefined 값이 넘어올 경우 조건 없이 전체 조회
        // search 값이 number 인 경우 score 매칭 추가, string 인 경우 comment 매칭 추가
        // TODO: isFinite() 메서드 정보 얻기, insentive 모드는 무엇인지 자세히 알아보기
        // TODO: 추후 rating 등의 검색 기능에 유사도? 등의 수치 적용하게 수정?
        const where: Prisma.UserRatingWhereInput | undefined = search
            ? isFinite(Number(search))
                ? {
                    OR: [
                        { comment: { contains: String(search), mode: 'insensitive' }},
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
                            // image_url: true,
                        }
                    }
                }
            })
        });
    }

    // rating 하나 조회 메서드 - 굳이 필요한가 싶지만 일단 만들고 볼 것
    async findOne(id: UserRating['id']) {
        const rating = await this.prisma.userRating.findFirst({ where: { id } });
        if (!rating) throw new NotFoundException('Rating Record Not found');
        return rating;
    }

    // rating 생성 메서드
    async createFromUser(userId: number, dto: CreateRatingDto) {
        const media = await this.prisma.media.findUnique({ where: { id: dto.mediaId } });
        if (!media) throw new NotFoundException('Media Record Not found');

        try {
            return await this.prisma.userRating.create({
                data: {
                    userId,
                    mediaId: dto.mediaId,
                    score: dto.score,
                    comment: dto.comment,
                },
            });
        } catch(err) {
            if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {
                throw new ConflictException('Your Rating already exists');
            }
            throw err;
        }
    }

    // rating 수정 메서드 -> authGuard 적용
    async updateFromUser(userId: number, id: number, dto: UpdateRatingDto) {
        const rating = await this.prisma.userRating.findUnique({ where: { id } });
        if (!rating) throw new NotFoundException('Rating Record Not found');

        // TODO: ConflictException || ForbiddenException 두 예외 중 어느 예외를 throw 하는 것이 더 적합한가
        if (rating.userId !== userId) throw new ForbiddenException('You are not the owner of this rating');

        return this.prisma.userRating.update({
            where: { id },
            data: dto,
        });
    }

    // rating 삭제 메서드
    async removeFromUser(userId: number, id: number) {
        const rating = await this.prisma.userRating.findUnique({ where: { id } });
        if (!rating) throw new NotFoundException('Rating Not Found');

        // TODO: ConflictException || ForbiddenException 두 예외 중 어느 예외를 throw 하는 것이 더 적합한가
        if (rating.userId !== userId) throw new ForbiddenException('You are not the owner of this rating');

        return this.prisma.userRating.delete({ where: { id } });
    }

    /*
    // rating 생성 메서드 -> createFromUser() 메서드로 대체
    async create(dto: CreateRatingDto): Promise<UserRating> {
        try {
            return await this.prisma.userRating.create({ data: dto });
        } catch(err) {
            return mapOrmError(err);
        }
    }

    // rating 수정 메서드 -> 동작 시에는 userId, mediaId 검증 절차 필요함
    async update(id: UserRating['id'], dto: UpdateRatingDto) {
        try {
            return await this.prisma.userRating.update({ where: { id }, data: dto });
        } catch(err) {
            return mapOrmError(err);
        }
    }

    // rating 삭제 메서드
    async remove(id: UserRating['id']) {
        try {
            return await this.prisma.userRating.delete({ where: { id } });
        } catch(err) {
            if (err instanceof PrismaClientKnownRequestError && err.code == 'P2025') {
                throw new NotFoundException('Rating Record Not found');
            }
            throw err;
        }
    }
     */
}