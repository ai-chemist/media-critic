import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
    sub: number;  // 사용자 id (PK)
    email: string;  // 식별자 email
}

export type JwtUser = { userId: number, email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_ACCESS_SECRET', 'dev_access_secret'),
        });
    }

    // payload 검증 후 return req.user
    async validate(payload: JwtPayload): Promise<JwtUser> {
        return { userId: payload.sub, email: payload.email };
    }
}