import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserQueryDto } from './dto/find-user.query.dto';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    findAll(query: FindUserQueryDto): Promise<{
        id: number;
        email: string;
        name: string | null;
        passwordHash: string;
        createdAt: Date;
    }[]>;
    findOne(id: User['id']): Promise<{
        id: number;
        email: string;
        name: string | null;
        passwordHash: string;
        createdAt: Date;
    }>;
    findMe(req: any): Promise<{
        id: number;
        email: string;
        name: string | null;
        createdAt: Date;
    }>;
    update(id: User['id'], dto: UpdateUserDto): Promise<{
        id: number;
        email: string;
        name: string | null;
        passwordHash: string;
        createdAt: Date;
    }>;
    remove(id: User['id']): Promise<{
        id: number;
        email: string;
        name: string | null;
        passwordHash: string;
        createdAt: Date;
    }>;
}
