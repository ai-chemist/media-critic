import { UsersService } from './users.service';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        email: string;
        name: string | null;
        createdAt: Date;
    }[]>;
}
