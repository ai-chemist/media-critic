import { IsEmail, IsOptional, IsString } from 'class-validator';

// User 생성용 Dto
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    name?: string;
}