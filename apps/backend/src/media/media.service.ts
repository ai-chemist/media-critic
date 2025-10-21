import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.media.findMany();
    }

    async findOne(id: number) {
        const media = await this.prisma.media.findUnique({ where: { id } });
        if (!media) throw new NotFoundException('해당하는 미디어를 찾을 수 없습니다.');
        return media;
    }

    async create(dto: CreateMediaDto) {
        return this.prisma.media.create({
            data: {
                title: dto.title,
                description: dto.description ?? '',
                type: dto.type,
                genre: dto.genre ?? '',
                year: dto.year,
                image_url: dto.imageUrl ?? '',
            },
        });
    }

    async update(id: number, dto: UpdateMediaDto) {
        const media = await this.findOne(id); // 존재 여부 확인
        return this.prisma.media.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.type !== undefined && { type: dto.type }),
                ...(dto.genre !== undefined && { genre: dto.genre }),
                ...(dto.year !== undefined && { year: dto.year }),
                ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
            },
        });
    }

    async remove(id: number) {
        await this.findOne(id); // 존재 여부 확인
        return this.prisma.media.delete({ where: { id } });
    }
}