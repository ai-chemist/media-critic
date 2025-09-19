import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserSelfDto } from './dto/update-user.self.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private ensureActiveUser;
    getSelf(userId: number): Promise<{
        id: number;
        email: string;
        username: never;
        created_at: never;
    } | null>;
    updateSelf(userId: number, dto: UpdateUserSelfDto): Promise<{
        id: number;
        email: string;
        username: never;
        created_at: never;
    }>;
    changePassword(userId: number, dto: UpdateUserPasswordDto): Promise<{
        ok: boolean;
    }>;
    softDeleteUser(userId: number): Promise<{
        ok: boolean;
    }>;
}
