import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function mapOrmError(err: unknown): never {
    // Prisma 에서 정의된 오류일 경우
    if (err instanceof PrismaClientKnownRequestError) {
        switch(err.code) {
            // Unique Constraint Failed - 중복 제약조건 위반
            case 'P2002':
                throw new ConflictException('Unique Constraint Failed');
            // Record Not Found - 레코드 찾을 수 없는 경우
            case 'P2025':
                throw new NotFoundException('Record Not found');
        }
    }
    // 위에서 처리하지 않은 종류의 에러 발생 시
    throw new BadRequestException('Database Error');
}