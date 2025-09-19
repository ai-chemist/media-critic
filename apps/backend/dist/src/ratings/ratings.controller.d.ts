import { RatingsService } from './rating.service';
import { FindRatingQueryDto } from './dto/find-rating.query.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
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
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    createFromUser(mediaId: number, req: any, dto: CreateRatingDto): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    updateFromUser(id: number, req: any, dto: UpdateRatingDto): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    removeFromUser(id: number, req: any): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
}
