import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateRatingDto {
    @IsOptional()
    @Type(() => Number) @IsInt() @Min(1) @Max(100)
    score?: number;

    @IsOptional()
    @IsString()
    comment?: string;
}