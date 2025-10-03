import { Controller, Body, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    // @Public()
    // @Post('login')
    // async login(@Body() dto: LoginDto) {
    //     return this.auth.loginByEmail(dto.email, dto.password);
    // }
}