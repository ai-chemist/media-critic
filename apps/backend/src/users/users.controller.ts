import { Controller, Body, Param, Get, Post, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly users: UsersService) {}

    // users - 전체 조회 (필터링 X)
    @Get()
    async findAll() {
        return await this.users.findAll();
    }

    // users/:id - 하나 조회
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: User['id']) {
        // ParseIntPipe - 자동으로 값을 파싱해주는 파이프
        return await this.users.findOne(id);
    }

    // create - 생성
    @Post()
    async create(@Body() dto: CreateUserDto) {
        return await this.users.create(dto);
    }

    // update - 수정
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: User['id'], @Body() dto: UpdateUserDto) {
        return await this.users.update(id, dto);
    }

    // remove - 삭제 (관례상 delete 대신 remove 사용)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: User['id']) {
        return await this.users.remove(id);
    }
}