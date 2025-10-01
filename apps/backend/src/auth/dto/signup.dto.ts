import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class SignupDto {
    @IsEmail() email: string;
    @IsString() @Length(2, 16) name: string;
    // 정규식을 통해 4자리 숫자를 string으로 받음
    @Matches(/^\d{4}$/) tag: string;
    @IsString() @Length(8, 255) password: string;
}