import { Controller, Body, Param, Get, Post, Patch, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { MediaService } from './media.service';

import { Media } from '@prisma/client';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FindMediaQueryDto } from './dto/find-media.query.dto';

@Controller('media')
export class MediaController {
    constructor(private readonly media: MediaService) {}

    // GET: media findAll() - 전체 및 조건 조회
    @Get()
    async findAll(@Query() query: FindMediaQueryDto) {
        return await this.media.findAll(query);
    }

    // GET: media/:id findOne() - 하나 조회
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: Media['id']) {
        // ParseIntPipe - 자동으로 값을 Integer 형식으로 변환해주는 파이프
        return await this.media.findOne(id);
    }

    // POST: media create() - 생성
    @Post()
    async create(@Body() dto: CreateMediaDto) {
        return await this.media.create(dto);
    }

    // PATCH: media/:id update() - 수정
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: Media['id'], @Body() dto: UpdateMediaDto) {
        return await this.media.update(id, dto);
    }

    // DELETE: media/:id remove() - 삭제 (관례상 delete 대신 remove 이름 사용)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: Media['id']) {
        return await this.media.remove(id);
    }
}