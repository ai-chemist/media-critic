import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
    // token이 없는 경우 401 반환 대신 req.user -> undefined로 수정
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err) return null;
        return user || null;
    }
}