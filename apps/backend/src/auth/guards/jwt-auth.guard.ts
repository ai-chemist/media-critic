import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

// TODO: any 제거 및 Error Message 통일 -> JSON 형태
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // Metadata 읽기 전용 utility: Reflector - SetMetadata(key, value) 한 값을 읽어옴
    constructor(private reflector: Reflector) { super(); }

    canActive(ctx: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (isPublic) return true;
        return super.canActivate(ctx);
    }

    // default: Exception -> throw 401
    handleRequest(err: any, user: any, info?: any, context?: ExecutionContext) {
        if (err || !user) {
            throw new UnauthorizedException('Unauthorized');
        }
        return user;
    }
}