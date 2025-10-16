import { IsOptional, IsString, MinLength } from 'class-validator';

export class DeleteUserDto {
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;
}