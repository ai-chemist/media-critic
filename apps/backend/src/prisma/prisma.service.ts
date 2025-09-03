/*
INestApplication: NestJS 어플리케이션 객체, 전역 제어용
Injectable: NestJS 의존성 주입 데커레이터
OnModuleInit: NestJS 라이프사이클 인터페이스, 모듈 초기화 시 실행 보장

PrismaClient: prisma generate 를 통해 생성, DB 접근 클라이언트
 */

import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // init 메서드
    async onModuleInit() {
        // 앱 시작 시 DB와 연결
        await this.$connect();
    }

    // DB 연결 종료
    async onModuleDestroy() {
        // 앱 종료 시 DB와 연결 종료
        await this.$disconnect();
    }
}