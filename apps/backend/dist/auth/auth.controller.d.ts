import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    private readonly refreshToken;
    constructor(authService: AuthService, refreshToken: RefreshTokenService);
    register(dto: RegisterDto, req: Request, res: Response): Promise<{
        user: any;
        tokens: {
            accessToken: string;
        };
    }>;
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            tag: any;
        };
        tokens: {
            accessToken: string;
        };
    }>;
    refresh(req: Request, res: Response): Promise<{
        tokens: {
            accessToken: string;
        };
    }>;
}
