import { IsIn, IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// User 검색 쿼리용 Dto
export class FindUserQueryDto {
    // 몇 개를 건너뛸지 (페이지네이션에 사용할 예정)
    @IsOptional() @Type(() => Number) @IsInt() @Min(0)
    skip?: number;

    // 검색 결과 값 제한 0 to 100으로 두어 과부화 방지
    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    take?: number;

    // 검색 조건으로 넘어올 문자열
    @IsOptional() @IsString()
    search?: string;

    // 정렬 기준 -> 추후 추가 및 수정할 예정
    @IsOptional() @IsIn(['email', 'name'])
    orderBy?: 'email' | 'name';

    // 오름차순, 내림차순 정렬 여부
    @IsOptional() @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';
}