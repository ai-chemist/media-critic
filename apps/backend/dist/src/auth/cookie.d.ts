import { Response } from 'express';
export declare function setRefreshCookie(res: Response, token: string, maxAge: number): void;
export declare function clearRefreshCookie(res: Response): void;
