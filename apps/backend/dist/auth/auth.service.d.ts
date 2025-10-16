import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.services';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenService } from './refresh-token.service';
export declare class AuthService {
    private readonly jwt;
    private readonly password;
    private readonly refreshToken;
    constructor(jwt: JwtService, password: PasswordService, refreshToken: RefreshTokenService);
    register(dto: RegisterDto, userAgent?: string, ip?: string): Promise<{
        user: any;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    loginByEmail(email: string, password: string, userAgent?: string, ip?: string): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            tag: any;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refresh(oldToken: string, userAgent?: string, ip?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logoutAll(userId: number): Promise<void>;
}
