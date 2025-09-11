import { PrismaService } from '../prisma/prisma.service';
import { UserRating } from '@prisma/client';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { FindRatingQueryDto } from './dto/find-rating.query.dto';
export declare class RatingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    createFromUser(userId: number, dto: CreateRatingDto): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    updateFromUser(userId: number, id: number, dto: UpdateRatingDto): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
    removeFromUser(userId: number, id: number): Promise<{
        id: number;
        createdAt: Date;
        mediaId: number;
        score: number;
        userId: number;
        comment: string | null;
        updatedAt: Date;
    }>;
}
