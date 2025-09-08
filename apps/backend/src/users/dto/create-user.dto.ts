import { IsEmail, IsOptional, IsString, Min } from 'class-validator';

// User 생성용 Dto
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsString()
    @Min(8)
    password: string;
}