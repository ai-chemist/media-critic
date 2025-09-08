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
        userId: number;
        mediaId: number;
        score: number;
        comment: string | null;
        updatedAt: Date;
    }[]>;
    findOne(id: UserRating['id']): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        mediaId: number;
        score: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    create(dto: CreateRatingDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        mediaId: number;
        score: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    update(id: UserRating['id'], dto: UpdateRatingDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        mediaId: number;
        score: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    remove(id: UserRating['id']): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        mediaId: number;
        score: number;
        comment: string | null;
        updatedAt: Date;
    }>;
}
