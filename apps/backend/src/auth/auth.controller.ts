import { Body, Controller, Post, Req, Res} from '@nestjs/common';
import type { Response, Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly refreshToken: RefreshTokenService,
    ) {}

    @Public()
    @Post('register')
    async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userAgent = req.get('user-agent') ?? undefined;
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim();
        const out = await this.authService.register(dto, userAgent, ip);
        res.cookie(this.refreshToken.getCookieName(), out.tokens.refreshToken, this.refreshToken.cookieOptions());
        return { user: out.user, tokens: { accessToken: out.tokens.accessToken } };
    }

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userAgent = req.get('user-agent') ?? undefined;
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim();
        const out = await this.authService.loginByEmail(dto.email, dto.password, userAgent, ip);
        res.cookie(this.refreshToken.getCookieName(), out.tokens.refreshToken, this.refreshToken.cookieOptions());
        return { user: out.user, tokens: { accessToken: out.tokens.accessToken } };
    }

    @Public()
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const old = req.cookies?.[this.refreshToken.getCookieName()];
        if (!old) throw new Error('No Refresh Token');
        const userAgent = req.get('user-agent') ?? undefined;
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim();

        const { accessToken, refreshToken } = await this.authService.refresh(old, userAgent, ip);
        res.cookie(this.refreshToken.getCookieName(), refreshToken, this.refreshToken.cookieOptions());
        return { tokens: { accessToken }}
    }

}