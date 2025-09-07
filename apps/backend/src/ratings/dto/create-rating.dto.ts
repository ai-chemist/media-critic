import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
    @Type(() => Number) @IsInt() @Min(1)
    userId: number;

    @Type(() => Number) @IsInt() @Min(1)
    mediaId: number;

    // 점수 1 to 100
    @Type(() => Number) @IsInt() @Min(1) @Max(100)
    score: number;

    // (선택 값) 한줄평
    @IsOptional()
    comment?: string;
}