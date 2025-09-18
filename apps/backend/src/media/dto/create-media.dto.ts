import {IsIn, IsInt, IsOptional, IsString} from 'class-validator';

// Media 생성용 Dto
export class CreateMediaDto {
    @IsString()
    title: string;

    @IsString() @IsIn(['GAME', 'MOVIE', 'BOOK', 'MUSIC'])
    type: string;

    @IsOptional() @IsInt()
    year?: number;

    @IsString()
    genre: string[];
}