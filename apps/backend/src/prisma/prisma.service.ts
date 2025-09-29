import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    // Application 종료 시 Prisma 함께 정상 종료
    async enableShutdownHooks(app: INestApplication) {
        // this.$on 사용 시 never 타입 추론 발생하여 process.on 사용
        process.on('beforeExit', async () => {
            await app.close();
        });
    }
}