import { IsEmail, IsString, Length } from 'class-validator';

// !를 붙여 컴파일러 단계에서 타입 안정성 유지
// 데코레이터 사용하여 형식 검증 강제
export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString() @Length(8, 255)
    password!: string;
}