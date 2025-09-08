export declare class FindRatingQueryDto {
    skip?: number;
    take?: number;
    search?: string;
    orderBy?: 'userId' | 'mediaId';
    order?: 'asc' | 'desc';
}
