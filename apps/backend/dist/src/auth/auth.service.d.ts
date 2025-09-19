import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    private sign;
    private signAccessToken;
    private signRefreshToken;
    private createRefreshSession;
    private findMatchedSession;
    signup(dto: SignupDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string | null;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string | null;
            createdAt: Date;
            deletedAt: Date | null;
            imageUrl: string | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(current: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(current: string): Promise<{
        ok: boolean;
    }>;
}
