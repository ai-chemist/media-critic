import { RatingsService } from './rating.service';
import { UserRating } from '@prisma/client';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { FindRatingQueryDto } from './dto/find-rating.query.dto';
export declare class RatingsController {
    private readonly ratings;
    constructor(ratings: RatingsService);
    findAll(query: FindRatingQueryDto): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }[]>;
    findOne(id: UserRating['id']): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    create(req: any, dto: CreateRatingDto): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    update(req: any, id: UserRating['id'], dto: UpdateRatingDto): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    remove(req: any, id: UserRating['id']): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
}
