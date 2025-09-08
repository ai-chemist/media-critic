import { PrismaService } from 'src/prisma/prisma.service';
import { Media } from '@prisma/client';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FindMediaQueryDto } from './dto/find-media.query.dto';
export declare class MediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    create(dto: CreateMediaDto): Promise<Media>;
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
}
