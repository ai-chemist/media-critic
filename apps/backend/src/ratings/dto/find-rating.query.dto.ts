import { IsIn, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FindRatingQueryDto {
    // 건너 뛸 개수 - 페이지네이션
    @IsOptional() @Type(() => Number) @IsInt() @Min(0)
    skip?: number;

    // 검색 결과 반환 값 제한 - 페이지네이션
    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    take?: number;

    // 검색 조건
    @IsOptional() @IsString()
    search?: string;

    // 작성자 기반 검색, 미디어 기반 검색 - 이름 값 등을 조회하여 id 로 반환? -> 추후 수정해야 할 듯
    @IsOptional() @IsIn(['userId', 'mediaId'])
    orderBy?: 'userId' | 'mediaId';

    @IsOptional() @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';
}