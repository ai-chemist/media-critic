import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    // jwt 발급을 위한 메서드 - 클래스 내부에서만 호출 가능
    private sign(payload: { sub: number, email: string }) {
        return this.jwt.sign(payload);
    }

    // 회원 가입 - 가입 완료 시 토큰 발급
    async signup(dto: SignupDto) {
        // TODO 추후 findUniqueOrThrow 메서드와 비교할 것
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Email already exists');
        // 입력 값으로 들어온 password를 해싱
        const passwordHash = await bcrypt.hash(dto.password, 12);

        const user = await this.prisma.user.create({
            data: { email: dto.email, name: dto.username, passwordHash },
            select: { id: true, email: true, name: true },
        });

        return { user, token: this.sign({ sub: user.id, email: user.email }) }
    }

    // 로그인 - 이메일 패스워드 검증 후 토큰 발급 -> 이미 만든 user 관련 메서드로 처리하는 방식은 어떨까?
    async login(dto: LoginDto) {
        // 예외 처리 시 같은 문구를 사용하여 email 존재 여부만 확인하려는 악성 접근 차단
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const compare = await bcrypt.compare(dto.password, user.passwordHash);
        if (!compare) throw new UnauthorizedException('Invalid email or password');

        const { passwordHash, ...safe } = user;
        return { user: safe, token: this.sign({ sub: user.id, email: user.email }) };
    }
}