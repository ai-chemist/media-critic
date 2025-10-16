import { Controller, Get, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
}