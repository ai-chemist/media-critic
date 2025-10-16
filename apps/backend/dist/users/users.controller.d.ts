import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getSelf(userId: number): Promise<import("./dto/user-profile.dto").UserProfileDto>;
    updateSelf(userId: number, dto: UpdateUserDto): Promise<import("./dto/user-profile.dto").UserProfileDto>;
}
