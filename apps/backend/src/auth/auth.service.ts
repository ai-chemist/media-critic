import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwt: JwtService) {}

    sign(payload: { sub: number, email: string }) {
        return this.jwt.sign(payload);
    }
}