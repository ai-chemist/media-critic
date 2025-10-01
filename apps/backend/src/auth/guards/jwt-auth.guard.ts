import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// TODO: any 제거 및 Error Message 통일 -> JSON 형태
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // default: Exception -> throw 401
    handleRequest(err: any, user: any, info?: any, context?: ExecutionContext) {
        if (err || !user) {
            throw new UnauthorizedException('Unauthorized');
        }
        return user;
    }
}