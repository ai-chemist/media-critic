import { IsOptional, IsString, Length, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(2, 16)
    name?: string;

    @IsOptional()
    @IsString()
    @Length(4)
    tag?: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}