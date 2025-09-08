import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { mapOrmError } from '../common/orm-exception';

import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserQueryDto } from './dto/find-user.query.dto';

// CRUD 메서드 - Prisma.UserXXXArgs -> 임시 처리 더 좋은 메서드나 방법 있을 시 수정할 것 -> Dto 방식으로 수정
@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    // users 전체 조회 메서드 -> Query를 통해 조회, 조건 X 일 경우 전체 조회
    async findAll(query: FindUserQueryDto) {
        const {
            skip = 0,
            take = 20,
            search,
            orderBy = 'email',
            order = 'desc',
        } = query;

        // undefined 값이 넘어올 경우 조건 없이 전체 조회
        const where: Prisma.UserWhereInput | undefined = search ? {
            OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ],
        }: undefined;

        return this.prisma.user.findMany({
            skip,
            take,
            where,
            orderBy: { [orderBy]: order },
        });
    }

    // user 하나 조회 메서드 - 조건에 맞는 대상 중 첫 데이터 반환
    async findOne(id: User['id']) {
        const user = await this.prisma.user.findFirst({ where: { id } });
        if (!user) throw new NotFoundException('User Record Not found');
        return user;
    }

    // user 생성 메서드 - 생성 메서드 중복 및 에러 처리를 위해 주석 처리
    // async create(dto: CreateUserDto): Promise<User> {
    //     try {
    //         return await this.prisma.user.create({ data: dto });
    //     } catch(err) {
    //         return mapOrmError(err);
    //     }
    // }

    // user 수정 메서드
    async update(id: User['id'], dto: UpdateUserDto) {
        try {
            return await this.prisma.user.update({ where: { id }, data: dto });
        } catch(err) {
            return mapOrmError(err);
        }
    }

    // user 삭제 메서드
    async remove(id: User['id']) {
        try {
            return await this.prisma.user.delete({ where: { id } });
        } catch(err) {
            // 일관성을 위해 P2025 오류 NotFound 에러로 치환
            if (err instanceof PrismaClientKnownRequestError && err.code == 'P2025') {
                throw new NotFoundException('User Record Not found');
            }
            throw err;
        }
    }
}