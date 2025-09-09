import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mapOrmError } from '../common/orm-exception';

import { Prisma, UserRating } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { FindRatingQueryDto } from './dto/find-rating.query.dto';

// Rating 부분은 전체적으로 보완해야함 - 메서드 실행 시 프런트 측에서 검증 후 세션이나 토큰 등으로 2차 검증 필요
@Injectable()
export class RatingsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(query: FindRatingQueryDto) {
        const {
            skip = 0,
            take = 30,
            search,
            orderBy = 'mediaId',
            order = 'desc'
        } = query;

        // undefined 값이 넘어올 경우 조건 없이 전체 조회 - schema 코드에서는 UserRating으로 작성됨 추후 이름 통일?
        const where: Prisma.UserRatingWhereInput | undefined = search ? {
            OR: [
                { comment: { contains: search, mode: 'insensitive' } },
                { score: { equals: Number(search) } },
            ],
        }: undefined;

        return this.prisma.userRating.findMany({
            skip,
            take,
            where,
            orderBy: { [orderBy]: order },
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

    // rating 생성 메서드 -> createFromUser() 메서드로 대체
    // async create(dto: CreateRatingDto): Promise<UserRating> {
    //     try {
    //         return await this.prisma.userRating.create({ data: dto });
    //     } catch(err) {
    //         return mapOrmError(err);
    //     }
    // }

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
}