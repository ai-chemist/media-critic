import { IsIn, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// Prisma version 6.x 기준의 작동 방법을 알아내기 전까지 임시로 사용 - MediaType를 enum 혹은 다른 table 등으로 생성하여 사용할 것

export class FindMediaQueryDto {
    // 건너 뛸 수
    @IsOptional() @Type(() => Number) @IsInt() @Min(0)
    skip?: number;

    // 검색 결과 값 제한
    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    take?: number;

    // 검색 조건
    @IsOptional() @IsString()
    search?: string;

    // 년도 검색
    @IsOptional() @Type(() => Number) @IsInt()
    year?: number;

    // media 타입 지정 검색
    @IsOptional()
    type?: string;

    @IsOptional() @IsIn([['createdAt', 'title', 'year']])
    orderBy?: 'createdAt' | 'title' | 'year';

    @IsOptional() @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';
}