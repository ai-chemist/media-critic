import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserSelfDto } from './dto/update-user.self.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

const SELECT_SELF = {
    id: true,
    email: true,
    username: true,
    // image_url: true,
    created_at: true,
} as const;

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    // 현재 활성 사용자 확인 - schema 내부에 deletedAt 필드 추가하여 삭제 유예기간 및 삭제 처리
    private async ensureActiveUser(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, deletedAt: true },
        });
        // User가 삭제될 예정이거나 이미 존재하지 않는 경우
        if (!user || user.deletedAt) {
            throw new NotFoundException('User Not found');
        }
        return user.id;
    }

    // 사용자 본인 프로필 조회
    async getSelf(userId: number) {
        await this.ensureActiveUser(userId);
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: SELECT_SELF,
        });
    }

    // 사용자 본인 프로필 수정
    async updateSelf(userId: number, dto: UpdateUserSelfDto) {
        await this.ensureActiveUser(userId);
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.username ?? undefined,
                // image_url: dto.image_url ?? undefined,
            },
            select: SELECT_SELF,
        });
    }

    // password 수정
    async changePassword(userId: number, dto: UpdateUserPasswordDto) {
        await this.ensureActiveUser(userId);

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, passwordHash: true },
        });
        return { ok: true };
    }

    // Soft Delete User -> TODO: schema에 deletedAt 필드 추가 후 활성화 할 것
    // async softDeleteUser(userId: number) {
    //     await this.ensureActiveUser(userId);
    //     await this.prisma.user.update({
    //         where: { id: userId },
    //         data: { deletedAt: new Date() },
    //     });
    //     return { ok: true };
    // }
}