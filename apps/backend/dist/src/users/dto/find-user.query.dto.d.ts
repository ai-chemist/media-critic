export declare class FindUserQueryDto {
    skip?: number;
    take?: number;
    search?: string;
    orderBy?: 'email' | 'name';
    order?: 'asc' | 'desc';
}
