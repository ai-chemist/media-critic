import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { RefreshTokenService } from '../auth/refresh-token.service';
export declare class UsersService {
    private readonly prisma;
    private readonly refreshToken;
    constructor(prisma: PrismaService, refreshToken: RefreshTokenService);
    private toProfile;
    getProfile(userId: number): Promise<UserProfileDto>;
    updateUser(userId: number, dto: UpdateUserDto): Promise<UserProfileDto>;
    deleteUser(userId: number, dto: DeleteUserDto): Promise<{
        success: true;
    }>;
}
