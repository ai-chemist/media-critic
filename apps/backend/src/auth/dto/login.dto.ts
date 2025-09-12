import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: 'test@example.com', description: '사용자 email' })
    email: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ minLength: 8, description: '최소 8자의 비밀번호 (영문 + 숫자 + 특수문자 혼합 등의 조합 추후 구현할 것)'})
    password: string;
}