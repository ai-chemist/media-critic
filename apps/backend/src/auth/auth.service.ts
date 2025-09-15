import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import * as argon from 'argon2';
import ms from 'ms';

type JwtPayload = { sub: number; role: 'user' | 'admin' };

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    //
    private sign(payload: { sub: number; email: string }) {
        return this.jwt.sign(payload);
    }

    // Access Token
    private async signAccessToken(payload: JwtPayload) {
        return await this.jwt.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '30m',
        });
    }

    // Refresh Token
    private async signRefreshToken(payload: JwtPayload) {
        return await this.jwt.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '3d',
        });
    }

    // Refresh Session Create
    private async createRefreshSession(userId: number, refreshToken: string) {
        const hash = await argon.hash(refreshToken);
        const expMs = ms(process.env.JWT_REFRESH_EXPIRES_IN ?? '3d');
        const expiresAt = new Date(Date.now() + expMs);

        await this.prisma.refreshSession.create({
            data: { userId, tokenHash: hash, expiresAt },
        });
    }

    // Refresh Token 매칭 검사
    private async findMatchedSession(
        userId: number,
        token: string,
    ): Promise<{ id: number } | null > {
        const sessions = await this.prisma.refreshSession.findMany({
            where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
            orderBy: { id: 'desc' },
            take: 10,
            select: { id: true, tokenHash: true },
        });

        for (const s of sessions) {
            if (await argon.verify(s.tokenHash, token)) return { id: s.id };
        }
        return null;
    }

    // 회원 가입
    async signup(dto: SignupDto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });

        // 이미 사용 중인 email 인 경우
        if (exists) throw new ConflictException('User already exists');

        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: { email: dto.email, name: dto.username, passwordHash },
            select: { id: true, email: true, name: true },
        });

        // 회원 가입 처리 및 토큰 발급 (자동 로그인)
        return { user, token: this.sign({ sub: user.id, email: user.email }) };
    }

    // 로그인 -> password 검증, Access & Refresh Token 발급 -> Refresh Token Session 저장
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        // email 을 찾을 수 없거나, password 가 일치하지 않는 경우 같은 문구를 출력하여 악의적 공격 방어
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid email or password');

        const payload: JwtPayload = { sub: user.id, role: 'user' };
        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken(payload),
            this.signRefreshToken(payload),
        ]);

        // Refresh Token Session 생성
        await this.createRefreshSession(user.id, refreshToken);

        const { passwordHash, ...safe } = user;
        return { user: safe, accessToken, refreshToken };
    }

    // Refresh: Refresh Token 검증 -> Session 검증 -> 기존 제거 및 새 Token 및 Session 생성
    async refresh(current: string) {
        let decoded: JwtPayload & { iat: number; exp: number };
        try {
            decoded = await this.jwt.verifyAsync(current, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const matched = await this.findMatchedSession(decoded.sub, current);
        // 재사용 방지
        if (!matched) {
            await this.prisma.refreshSession.updateMany({
                where: { userId: decoded.sub, revokedAt: null },
                data: { revokedAt: new Date() },
            });
            throw new ForbiddenException('Refresh token reuse detected');
        }

        // 기존 Session 무효화
        await this.prisma.refreshSession.update({
            where: { id: matched.id },
            data: { revokedAt: new Date() },
        });

        // 새 Token 생성
        const payload: JwtPayload = { sub: decoded.sub, role: 'user' };
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.signAccessToken(payload),
            this.signRefreshToken(payload),
        ]);

        // 새 Refresh Token Session 생성
        await this.createRefreshSession(decoded.sub, newRefreshToken);

        // 새 토큰 반환
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    // 로그아웃: 제출된 Refresh Token과 매칭되는 Session 무효화(멱등..?)
    async logout(current: string) {
        try {
            const decoded = await this.jwt.verifyAsync<JwtPayload & { iat: number, exp: number }>(
                current, { secret: process.env.JWT_REFRESH_SECRET },
            );
            const matched = await this.findMatchedSession(decoded.sub, current);
            if (matched) {
                await this.prisma.refreshSession.update({
                    where: { id: matched.id },
                    data: { revokedAt: new Date() },
                });
            }
        } catch(err) {
            // TODO: 더 나은 처리 방안이 있을 것
            throw new InternalServerErrorException('Failed to logout');
        }
        return { ok: true };
    }
}