import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string | null;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string | null;
            createdAt: Date;
            deletedAt: Date | null;
            imageUrl: string | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
}
