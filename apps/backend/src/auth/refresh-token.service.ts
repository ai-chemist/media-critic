import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenService {
    private readonly cookieName: string;
    private readonly refreshSecret: string;
    private readonly refreshExpires: string;

    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {
        this.cookieName = this.config.get<string>('JWT_REFRESH_COOKIE_NAME') ?? 'rt';
        this.refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET')!;
        this.refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES', '7d');
    }

    getCookieName(): string {
        return this.cookieName;
    }

    cookieOptions() {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/api/auth/refresh',
        };
    }

    async issueRefreshToken(userId: number, userAgent?: string, ip?: string) {
        const refreshToken = await this.jwt.signAsync(
            { sub: userId, typ: 'refresh' },
            { secret: this.refreshSecret, expiresIn: this.refreshExpires },
        );

        const tokenHash = await argon2.hash(refreshToken, { type: argon2.argon2id });
        const expiresAt = new Date(Date.now() + this.parseDurationMs(this.refreshExpires));

        await this.prisma.refreshToken.create({
            data: { userId, tokenHash, userAgent, ip, expiresAt },
        });

        return refreshToken;
    }

    async rotate(oldToken: string, userAgent?: string, ip?: string) {
        const payload = await this.jwt.verifyAsync(oldToken, { secret: this.refreshSecret });
        const userId = payload.sub as number;

        const rows = await this.prisma.refreshToken.findMany({
            where: { userId, revoked: false, expiresAt: { gt: new Date() } },
            select: { id: true, tokenHash: true },
        });

        const matched = await this.findMatch(rows, oldToken);
        if (!matched) {
            // 재사용 의심 시 활성 RefreshToken 전부 폐기
            await this.prisma.refreshToken.updateMany({
                where: { userId, revoked: false },
                data: { revoked: true },
            });
            throw new Error('Refresh token reuse detected');
        }

        await this.prisma.refreshToken.update({
            where: { id: matched.id },
            data: { revoked: true },
        });

        const newToken = await this.issueRefreshToken(userId, userAgent, ip);
        return { userId, newToken };
    }

    async revokeAll(userId: number) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true },
        });
    }

    private async findMatch(
        rows: { id: number, tokenHash: string }[],
        token: string,
    ) {
        for (const row of rows) {
            if (await argon2.verify(row.tokenHash, token)) return row;
        }
        return null;
    }

    // ms로 파싱
    private parseDurationMs(input: string): number {
        const match = /^(\d+)([smhd])$/.exec(input);
        if (!match) throw new Error('Invalid duration format');
        const num = Number(match[1]);
        switch (match[2]) {
            case 's': return num * 1e3;
            case 'm': return num * 6e4;
            case 'h': return num * 36e5;
            default: return num * 864e5;  // d
        }
    }
}