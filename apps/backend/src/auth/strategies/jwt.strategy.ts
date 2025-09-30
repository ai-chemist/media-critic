import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";

// import { UserService } from '../../users/user.service';

const JwtPayloadSchema = z.object({
    sub: z.number().int().positive(),
    name: z.string().max(16).optional()
});

type JwtPayload = z.infer<typeof JwtPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, /* private readonly users: UsersService */) {
        super({
            // 어디서 토큰을 읽어올 것인지
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 만료 토큰 즉시 거부
            ignoreExpiration: false,
            // 서명 검증 키 config에서 get
            secretOrKey: config.get<string>('JWT_ACCESS_SECRET')!,
            // JWT 발급자 검사
            issuer: 'api',
            // JWT 발급 대상자 검사
            audience: 'web',
            // 허용할 알고리즘 화이트리스트
            algorithms: ['HS256'],
        });
    }

    async validate(payload: unknown) {
        const p = JwtPayloadSchema.safeParse(payload);
        if (!p.success) { throw new UnauthorizedException('Invalid JWT Payload'); }

        // const user = await this.users.findActiveById(p.data.sub);
        // if (!user) { throw new UnauthorizedException('User Not Found'); }

        // return { userId: user.id, name: user.name };
    }
}