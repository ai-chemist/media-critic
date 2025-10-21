import {IsEnum, IsOptional, IsString, MaxLength, IsInt, Min, Length} from 'class-validator';
import { MediaType } from '@prisma/client';

export class CreateMediaDto {
    @IsString()
    @MaxLength(32)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(128)
    description?: string;

    @IsEnum(MediaType)
    type: MediaType; // MOVIE | GAME | BOOK (대문자)

    @IsOptional()
    @IsString()
    @MaxLength(255)
    genre?: string;

    @IsInt()
    @Length(4, 4)
    year: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;
}