import { Response } from 'express';

export function setRefreshCookie(res: Response, token: string, maxAge: number) {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN,
        path: '/auth',
        maxAge: maxAge,
    });
}

export function clearRefreshCookie(res: Response) {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN,
        path: '/auth',
    });
}