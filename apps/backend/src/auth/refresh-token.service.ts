import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
    // private readonly cookie: string;
    // private readonly refreshSecret: string;
    // private readonly refreshExpires: string;
    //
    // constructor(
    //     private readonly prisma: PrismaService,
    //     private readonly jwt: JwtService,
    //     private readonly cfg: ConfigService,
    // )
}