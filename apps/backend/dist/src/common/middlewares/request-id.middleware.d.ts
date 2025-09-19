import { NestMiddleware } from '@nestjs/common';
export declare class RequestIdMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
}
