import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class RatingAggregateQueryDto {
    @Type(() => Number)
    @IsInt()
    mediaId: number;
}