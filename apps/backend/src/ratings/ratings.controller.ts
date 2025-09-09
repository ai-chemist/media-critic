import {Controller, Req, Body, Param, Get, Post, Patch, Delete, ParseIntPipe, Query, UseGuards} from '@nestjs/common';
import { RatingsService } from './rating.service';
import { AuthGuard } from '@nestjs/passport';

import { UserRating } from '@prisma/client';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { FindRatingQueryDto } from './dto/find-rating.query.dto';

@Controller('ratings')
@UseGuards(AuthGuard('jwt')) // 컨트롤러 전체를 보호
export class RatingsController {
    constructor(private readonly ratings: RatingsService) {}

    // GET: ratings findAll() - 전체 및 조건 조회
    @Get()
    async findAll(@Query() query: FindRatingQueryDto) {
        return await this.ratings.findAll(query);
    }

    // GET: ratings/:id findOne() - 하나 조회
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: UserRating['id']) {
        return await this.ratings.findOne(id);
    }

    // POST: ratings create() - 생성
    @Post()
    async create(@Req() req: any, @Body() dto: CreateRatingDto) {
        const userId = req.user.userId;
        return await this.ratings.createFromUser(userId, dto);
    }

    // PATCH: ratings/:id update() - 수정
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: UserRating['id'], @Body() dto: UpdateRatingDto) {
        return await this.ratings.update(id, dto);
    }

    // DELETE: ratings/:id remove() - 삭제
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: UserRating['id']) {
        return await this.ratings.remove(id);
    }
}