import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
    // @IsEmail()
    @IsString()
    email: string;

    // TODO 추후 닉네임을 영어 기준 n자, 한글 기준 m자로 제한하는 기능
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(16)
    username: string;

    @IsString()
    @MinLength(8)
    password: string;
}