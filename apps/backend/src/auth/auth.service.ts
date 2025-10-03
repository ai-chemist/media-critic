import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.servies';
// import { UsersService } from '../users/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly password: PasswordService,
        // private readonly users: UsersService,
    ) {}

    // async loginByEmail(email: string, password: string) {
    //     const user = await this.users.findByEmail(email);
    //     if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    //
    //     const correct = await this.password.verify(user.passwordHash, password);
    //     if (!correct) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    //
    //     const accessToken = await this.jwt.signAsync(
    //         { sub: user.id, email: user.email },
    //     );
    //
    //     return {
    //         user: { id: user.id, email: user.email, name: user.name, tag: user.tag },
    //         tokens: { accessToken },
    //     };
    // }
}