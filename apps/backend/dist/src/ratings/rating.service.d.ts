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
    create(dto: CreateRatingDto): Promise<UserRating>;
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
