import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @IsEmail()
    @ApiProperty({ example: 'test@example.com', description: '사용자의 email' })
    email: string;

    // TODO 추후 닉네임을 영어 기준 n자, 한글 기준 m자로 제한하는 기능
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(16)
    @ApiProperty({ example: 'User', minLength: 2, maxLength: 16, description: '사용자의 활동명, 추후 영문 한글 여부에 따라 글자 수 제한 기능'})
    username: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ minLength: 8, description: '사용자의 비밀번호 최소 8자' })
    password: string;
}