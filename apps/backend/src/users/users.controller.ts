import {Controller, Req, Body, Param, Get, Patch, Delete, ParseIntPipe, Query, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserQueryDto } from './dto/find-user.query.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly users: UsersService) {}

    // GET: users findAll() - 전체 조회 (전달하는 인수에 따라 조건에 맞게 결과 반환)
    @Get()
    async findAll(@Query() query: FindUserQueryDto) {
        return await this.users.findAll(query);
    }

    // GET: users/:id findOne() - 하나 조회
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: User['id']) {
        // ParseIntPipe - 자동으로 값을 파싱해주는 파이프
        return await this.users.findOne(id);
    }

    // GET: users/me findMe() - 인증된 사용자의 본인 정보 조회
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async findMe(@Req() req: any) {
        return await this.users.findMe(req.user.userId);
    }

    // PATCH: users/:id update() - 수정
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: User['id'], @Body() dto: UpdateUserDto) {
        return await this.users.update(id, dto);
    }

    // DELETE: users/:id remove() - 삭제 (관례상 delete 대신 remove 사용)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: User['id']) {
        return await this.users.remove(id);
    }

    // POST: users/ create() - 생성 - 생성 메서드 중복 및 에러로 인해 주석 처리
    // @Post()
    // async create(@Body() dto: CreateUserDto) {
    //     return await this.users.create(dto);
    // }
}