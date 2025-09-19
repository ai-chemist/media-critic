import { UsersService } from './users.service';
import { UpdateUserSelfDto } from './dto/update-user.self.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    getMyProfile(req: any): Promise<{
        id: number;
        email: string;
        username: never;
        created_at: never;
    } | null>;
    updateMyProfile(req: any, dto: UpdateUserSelfDto): Promise<{
        id: number;
        email: string;
        username: never;
        created_at: never;
    }>;
    changeMyPassword(req: any, dto: UpdateUserPasswordDto): Promise<{
        ok: boolean;
    }>;
    softDeleteUser(req: any): Promise<{
        ok: boolean;
    }>;
}
