import { MediaService } from './media.service';
import { Media } from '@prisma/client';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FindMediaQueryDto } from './dto/find-media.query.dto';
export declare class MediaController {
    private readonly media;
    constructor(media: MediaService);
    findAll(query: FindMediaQueryDto): Promise<{
        type: string;
        id: number;
        createdAt: Date;
        title: string;
        year: number | null;
        externalId: string | null;
        source: string | null;
    }[]>;
    findOne(id: Media['id']): Promise<{
        type: string;
        id: number;
        createdAt: Date;
        title: string;
        year: number | null;
        externalId: string | null;
        source: string | null;
    }>;
    create(dto: CreateMediaDto): Promise<{
        type: string;
        id: number;
        createdAt: Date;
        title: string;
        year: number | null;
        externalId: string | null;
        source: string | null;
    }>;
    update(id: Media['id'], dto: UpdateMediaDto): Promise<{
        type: string;
        id: number;
        createdAt: Date;
        title: string;
        year: number | null;
        externalId: string | null;
        source: string | null;
    }>;
    remove(id: Media['id']): Promise<{
        type: string;
        id: number;
        createdAt: Date;
        title: string;
        year: number | null;
        externalId: string | null;
        source: string | null;
    }>;
    getSummary(req: any, id: Media['id']): Promise<{
        media: {
            type: string;
            id: number;
            createdAt: Date;
            title: string;
            year: number | null;
        };
        rating: {
            avg: number | null;
            count: number;
            myRating: import("@prisma/client").Prisma.Prisma__UserRatingClient<{
                id: number;
                score: number;
                comment: string | null;
                updatedAt: Date;
            } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions> | null;
        };
    }>;
}
