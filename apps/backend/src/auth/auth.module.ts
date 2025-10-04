import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordService } from './password.services';

@Module({
    imports: [
        ConfigModule,
        // UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_ACCESS_SECRET', 'dev_access_secret'),
                signOptions: {
                    expiresIn: config.get<string>('JWT_ACCESS_EXPIRES', '15m'),
                },
            }),
        }),
    ],
    providers: [
        JwtStrategy,
        PasswordService,
    ],
    controllers: [
        AuthController,
    ],
    exports: [
        JwtModule,
        PassportModule,
        PasswordService,
    ],
})
export class AuthModule {}