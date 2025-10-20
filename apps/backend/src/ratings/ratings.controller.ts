import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingListQueryDto } from './dto/rating-list.query.dto';
import { RatingAggregateQueryDto } from './dto/rating-aggregate.query.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    // 생성
    @Post()
    createRating(@CurrentUser('sub') userId: number, @Body() dto: CreateRatingDto) {
        return this.ratingsService.createRating(Number(userId), dto);
    }

    // 1개 조회
    @Get(':id')
    findRating(@Param('id') id: string) {
        return this.ratingsService.findRating(Number(id));
    }

    // 목록 조회
    @Get()
    findRatingList(@Query() query: RatingListQueryDto) {
        return this.ratingsService.findRatingList(query);
    }

    // 집계
    @Get('aggregate')
    aggregateRating(@Query() query: RatingAggregateQueryDto) {
        return this.ratingsService.aggregateRating(query.mediaId);
    }

    // 수정: 본인 인증 후
    @Patch(':id')
    updateRating(
        @Param('id') id: string, @CurrentUser('sub') userId: number, @Body() dto: UpdateRatingDto
    ) {
        return this.ratingsService.updateRating(Number(id), Number(userId), dto);
    }

    // 삭제: 본인 인증 후
    @Delete(':id')
    removeRating(
        @Param('id') id: string, @CurrentUser('sub') userId: number
    ) {
        return this.ratingsService.removeRating(Number(id), Number(userId));
    }
}