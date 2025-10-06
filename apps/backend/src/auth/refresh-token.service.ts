import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
    private readonly cookie: string;
    private readonly refreshSecret: string;
    private readonly refreshExpires: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly cfg: ConfigService,
    ) {
        this.cookie = this.cfg.get<string>('REFRESH_COOKIE_NAME') ?? 'rtrtrt';
        this.refreshSecret = this.cfg.get<string>('JWT_REFRESH_SECRET')!;
        this.refreshExpires = this.cfg.get<string>('JWT_REFRESH_EXPIRES', '7d');
    }

    getCookie(): string {
        return this.cookie;
    }

    getCookieOptions() {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/api/auth/refresh',
        };
    }

    async issue(userId: number, userAgent: string, ip?: string) {

    }

}