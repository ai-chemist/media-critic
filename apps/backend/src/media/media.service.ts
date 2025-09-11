import {Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { mapOrmError } from "../common/orm-exception";

import { Prisma, Media } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaPromise } from '@prisma/client/runtime/library';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FindMediaQueryDto } from './dto/find-media.query.dto';

@Injectable()
export class MediaService {
    constructor(private readonly prisma: PrismaService) {}

    // media 전체 조회 메서드 -> Query 여부에 따라 조건 설정 여부 결정
    async findAll(query: FindMediaQueryDto) {
        const {
            skip = 0,
            take = 30,
            search,
            year,
            type,
            orderBy = 'year',
            order = 'desc',
        } = query;

        // undefined 값이 넘어올 경우 조건 없이 전체 조회
        const where: Prisma.MediaWhereInput | undefined = search ? {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { type: { contains: search, mode: 'insensitive' }},
                // { genre: { contains: search, mode: 'insensitive' } }, 추후 장르 추가 시 사용
            ],
        }: undefined;

        return this.prisma.media.findMany({
            skip,
            take,
            where,
            orderBy: { [orderBy]: order },
        });
    }

    // media 하나 조회 메서드 - 조건에 맞는 대상 중 첫 데이터 반환
    async findOne(id: Media['id']) {
        const media = await this.prisma.media.findFirst({ where: { id } });
        if (!media) throw new NotFoundException('Media Record Not found');
        return media;
    }

    // media 생성 메서드
    async create(dto: CreateMediaDto): Promise<Media> {
        try {
            return await this.prisma.media.create({ data: dto });
        } catch(err) {
            return mapOrmError(err);
        }
    }

    // media 수정 메서드
    async update(id: Media['id'], dto: UpdateMediaDto) {
        try {
            return await this.prisma.media.update({ where: { id }, data: dto });
        } catch(err) {
            return mapOrmError(err);
        }
    }

    // media 삭제 메서드
    async remove(id: Media['id']) {
        try {
            return await this.prisma.media.delete({ where: { id } });
        } catch(err) {
            if (err instanceof PrismaClientKnownRequestError && err.code == 'P2025') {
                throw new NotFoundException('Media Record Not found');
            }
            throw err;
        }
    }

    // TODO: 데이터 분석 적용 시 전면 수정할 것
    // User['id'] 사용과 number 사용 중 고민할 것
    async getSummary(id: Media['id'], userId?: number) {
        const media = await this.prisma.media.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                year: true,
                type: true,
                createdAt: true,
            }
        });
        if (!media) throw new NotFoundException('Media Record Not found');

        // agg & myRating 두 가지를 트랜잭션으로 묶어야 하는지, 트랜잭션 ACID 특징을 지킬 수 있을 지 고민할 것
        const agg = await this.prisma.userRating.aggregate({
            where: { mediaId: id },
            _avg: { score: true },
            _count: { _all: true },
        });

        const myRating = userId ? this.prisma.userRating.findUnique({
            where: { userId_mediaId: { userId, mediaId: id } },
            select: { id: true, score: true, comment: true, updatedAt: true },
        }) : null;

        return {
            media,
            rating: {
                avg: agg._avg.score ?? null,
                count: agg._count._all,
                myRating: myRating,
            },
        };
    }

    // 트랜잭션으로 관리 - 선택적 적용 (로그인 시 사용자의 평점 출력)을 위해 함수 확장
    // const [{ _avg, _count }] = await this.prisma.$transaction([
    //     this.prisma.userRating.aggregate({
    //         where: { mediaId: id },
    //         _avg: { score: true },
    //         _count: { _all: true },
    //     }),
    // ]);
}