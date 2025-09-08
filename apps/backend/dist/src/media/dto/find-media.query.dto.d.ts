export declare class FindMediaQueryDto {
    skip?: number;
    take?: number;
    search?: string;
    year?: number;
    type?: string;
    orderBy?: 'createdAt' | 'title' | 'year';
    order?: 'asc' | 'desc';
}
