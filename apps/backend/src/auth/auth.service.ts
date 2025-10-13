import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.services';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly password: PasswordService,
        private readonly refreshToken: RefreshTokenService,
        // private readonly users: UsersService,
    ) {}

    async register(dto: RegisterDto, userAgent?: string, ip?: string) {
        const user = await this.users.createUser(dto);
        const accessToken = await this.jwt.signAsync({ sub: user.id });
        const refreshToken = await this.refreshToken.issueRefreshToken(user.id, userAgent, ip);
        return { user, tokens: { accessToken, refreshToken } };
    }

    async loginByEmail(email: string, password: string, userAgent?: string, ip?: string) {
        const user = await this.users.findByEmail(email);
        if(!user) throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
        const ok = await this.password.verify(user.passwordHash, password);
        if(!ok) throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');

        const accessToken = await this.jwt.signAsync({ sub: user.id });
        const refreshToken = await this.refreshToken.issueRefreshToken(user.id, userAgent, ip);
        return {
            user: { id: user.id, email: user.email, name: user.name, tag: user.tag },
            tokens: { accessToken, refreshToken },
        };
    }

    async refresh(oldToken: string, userAgent?: string, ip?: string) {
        const { userId, newToken } = await this.refreshToken.rotate(oldToken, userAgent, ip);
        const accessToken = await this.jwt.signAsync({ sub: userId });
        return { accessToken, refreshToken: newToken };
    }

    async logoutAll(userId: number) {
        await this.refreshToken.revokeAll(userId);
    }
}