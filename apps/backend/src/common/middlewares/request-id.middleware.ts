import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const incoming = req.headers['x-request-id'] as string | undefined;
        const id = incoming && incoming.trim() !== '' ? incoming : v4();
        req.requestId = id;
        res.setHeader('x-request-id', id);
        next();
    }
}