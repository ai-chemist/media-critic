import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserQueryDto } from './dto/find-user.query.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: FindUserQueryDto): Promise<{
        email: string;
        name: string | null;
        id: number;
        passwordHash: string;
        createdAt: Date;
    }[]>;
    findOne(id: User['id']): Promise<{
        email: string;
        name: string | null;
        id: number;
        passwordHash: string;
        createdAt: Date;
    }>;
    findMe(id: User['id']): Promise<{
        email: string;
        name: string | null;
        id: number;
        createdAt: Date;
    }>;
    update(id: User['id'], dto: UpdateUserDto): Promise<{
        email: string;
        name: string | null;
        id: number;
        passwordHash: string;
        createdAt: Date;
    }>;
    remove(id: User['id']): Promise<{
        email: string;
        name: string | null;
        id: number;
        passwordHash: string;
        createdAt: Date;
    }>;
}
