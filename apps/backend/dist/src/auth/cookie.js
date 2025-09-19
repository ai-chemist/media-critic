"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshCookie = setRefreshCookie;
exports.clearRefreshCookie = clearRefreshCookie;
function setRefreshCookie(res, token, maxAge) {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN,
        path: '/auth',
        maxAge: maxAge,
    });
}
function clearRefreshCookie(res) {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN,
        path: '/auth',
    });
}
//# sourceMappingURL=cookie.js.map