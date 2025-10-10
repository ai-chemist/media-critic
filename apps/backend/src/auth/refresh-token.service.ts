// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import * as argon2 from 'argon2';
//
// import { PrismaService } from '../prisma/prisma.service';
//
// @Injectable()
// export class RefreshTokenService {
//     private readonly cookie: string;
//     private readonly refreshSecret: string;
//     private readonly refreshExpires: string;
//
//     constructor(
//         private readonly prisma: PrismaService,
//         private readonly jwt: JwtService,
//         private readonly cfg: ConfigService,
//     ) {
//         this.cookie = this.cfg.get<string>('REFRESH_COOKIE_NAME') ?? 'rtrtrt';
//         this.refreshSecret = this.cfg.get<string>('JWT_REFRESH_SECRET')!;
//         this.refreshExpires = this.cfg.get<string>('JWT_REFRESH_EXPIRES', '7d');
//     }
//
//     getCookie(): string {
//         return this.cookie;
//     }
//
//     getCookieOptions() {
//         return {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax' as const,
//             path: '/api/auth/refresh',
//         };
//     }
//
//     async issue(userId: number, userAgent: string, ip?: string) {
//         const refreshToken = await this.jwt.signAsync(
//             { sub: userId, type: 'refresh' },
//             { secret: this.refreshSecret, expiresIn: this.refreshExpires },
//         );
//
//         const tokenHash = await argon2.hash(refreshToken, { type: argon2.argon2id });
//         const expiresAt = new Date(Date.now() + this.parseDurationMs(this.refreshExpires));
//
//         await this.prisma.refreshToken.create({
//             data: { userId, tokenHash, userAgent, ip, expiresAt },
//         });
//
//         return refreshToken;
//     }
//
//     async rotate(old: string, userAgent?: string, ip?: string) {
//         const payload = await this.jwt.verifyAsync(old, { secret: this.refreshSecret });
//         const userId = payload.sub as number;
//
//         const rows = await this.prisma.refreshToken.findMany({
//             where: { userId, revoked: false, expiresAt: { gt: new Date() } },
//             select: { id: true, tokenHash: true },
//         });
//
//         const matched = await this.findMatch(rows, oldToken);
//         if (!matched) {
//             await this.prisma.refreshToken.updateMany({
//                 where: { userId, revoked: false },
//                 data: { revoked: true },
//             });
//             throw new Error('Refresh token reuse detected');
//         }
//
//         await this.prisma.refreshToken.update({ where: { id: matched.id }, data: { revoked: true } });
//
//         const new = await this.issue(userId, userAgent, ip);
//         return { userId, new };
//
//     }
//
//     async revoke(userId: string) {
//         await this.prisma.refreshToken.updateMany({
//             where: { userId, revoked: false },
//             data: { revoked: true },
//         });
//     }
//
//     // TODO: 타 파일로 분리할 것
//     private async findMatch(rows: { id: number; tokenHash: string }[], token: string) {
//         for (const row of rows) {
//             if (await argon2.verify(row.tokenHash, token)) return row;
//         }
//         return null;
//     }
//
//     private parseDurationMs(inputDuration: string): number {
//         const ms = /^(\d+)([smhd])$/.exec(inputDuration);
//         if (!ms) return 0;
//         const n = Number(ms[1]);
//         switch (ms[2]) {
//             case 's': return n * 1e3;  // second
//             case 'm': return n * 60e3;  // minute
//             case 'h': return n * 3600e3;  // hour
//             default: return n * 24 * 3600e3;  // day
//         }
//     }
// }