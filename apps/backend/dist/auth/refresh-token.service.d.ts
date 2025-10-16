import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class RefreshTokenService {
    private readonly jwt;
    private readonly prisma;
    private readonly config;
    private readonly cookieName;
    private readonly refreshSecret;
    private readonly refreshExpires;
    constructor(jwt: JwtService, prisma: PrismaService, config: ConfigService);
    getCookieName(): string;
    cookieOptions(): {
        httpOnly: boolean;
        secure: boolean;
        sameSite: "lax";
        domain: string | undefined;
        path: string;
    };
    issueRefreshToken(userId: number, userAgent?: string, ip?: string): Promise<string>;
    rotate(oldToken: string, userAgent?: string, ip?: string): Promise<{
        userId: number;
        newToken: string;
    }>;
    revokeAll(userId: number): Promise<void>;
    private findMatch;
    private parseDurationMs;
}
