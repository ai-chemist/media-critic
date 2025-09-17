import { Body, Req, Param, Query, Controller, Get, Post, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RatingsService } from './rating.service';
import { FindRatingQueryDto } from './dto/find-rating.query.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { OptionalJwtGuard as JwtGuard } from '../auth/optional-jwt.guard';

// ratings/ 경로가 아닌 경로를 사용하는 경우도 있기에 비워둠
@Controller()
export class RatingsController {
    constructor(private readonly ratings: RatingsService) {}

    // 목록 조회 (검색/정렬/페이지네이션)
    @Get('ratings')
    async findAll(@Query() query: FindRatingQueryDto) {
        return await this.ratings.findAll(query);
    }

    // rating 하나 조회 -> 필요 없을 것 같기는 함
    @Get('ratings/:id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.ratings.findOne(id);
    }

    // 사용자의 평가 생성
    // TODO: media 경로로 분리?
    @UseGuards(JwtGuard)
    @Post('media/:mediaId/create-ratings')
    async createFromUser(@Param('mediaId', ParseIntPipe) mediaId: number, @Req() req: any, @Body() dto: CreateRatingDto) {
        const fixed: CreateRatingDto = { ...dto, mediaId };
        return await this.ratings.createFromUser(req.user.sub, fixed);
    }

    // 평가 수정 - 사용자 본인의 평가만 수정 가능
    @UseGuards(JwtGuard)
    @Patch('ratings/:id')
    async updateFromUser(@Param('id', ParseIntPipe) id: number, @Req() req: any, @Body() dto: UpdateRatingDto) {
        return await this.ratings.updateFromUser(req.user.sub, id, dto);
    }

    // 평가 삭제
    @UseGuards(JwtGuard)
    @Delete('ratings/:id')
    async removeFromUser(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return await this.ratings.removeFromUser(req.user.sub, id);
    }
}