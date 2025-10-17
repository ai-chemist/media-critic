import {Body, Controller, Delete, Get, Patch, Res} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {CurrentUser} from '../common/decorators/current-user.decorator';
import {DeleteUserDto} from './dto/delete-user.dto';
import type {Response} from 'express';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('self')
    async getSelf(@CurrentUser('sub') userId: number) {
        return this.usersService.getProfile(Number(userId));
    }

    @Patch('self')
    async updateSelf(@CurrentUser('sub') userId: number, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(Number(userId), dto);
    }

    @Delete('self')
    async deleteSelf(@CurrentUser('sub') userId: number, @Body() dto: DeleteUserDto, @Res( { passthrough: true }) res: Response) {
        res.clearCookie('rt', {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            path: '/auth',
        });

        return await this.usersService.deleteUser(Number(userId), dto);
    }
}