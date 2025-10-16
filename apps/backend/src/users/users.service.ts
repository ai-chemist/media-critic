import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User} from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    // Pick<>: TS에서 특정 키를 뽑아 새 타입을 생성하는 유틸리티 타입
    private toProfile(user: Pick<User, 'id'|'email'|'name'|'tag'|'imageUrl'|'createdAt'>) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            tag: user.tag,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
        };
    }

    async getProfile(userId: number): Promise<UserProfileDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, tag: true, imageUrl: true, createdAt: true },
        });
        if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
        return this.toProfile(user);
    }

    async updateUser(userId: number, dto: UpdateUserDto): Promise<UserProfileDto> {
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
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ConflictException('이미 존재하는 조합입니다.');
            }
            throw err;
        }
    }

}