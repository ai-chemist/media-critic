import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('media')
export class MediaController {
    constructor(private readonly media: MediaService) {}

    @Get()
    async findAll() {
        return this.media.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.media.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateMediaDto) {
        return this.media.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: number, @Body() dto: UpdateMediaDto) {
        return this.media.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param(':id') id: number) {
        return this.media.remove(id);
    }
}