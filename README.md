## media-critic-alpha (Multimedia Critic Web System)

&nbsp;

> 💡 프로젝트 목적 : 면접 시 제출할 포트폴리오 / 시스템 전반의 설계 및 개발, 테스트를 통한 실력 향상 및 개발 과정 전반에 대한 이해

&nbsp;

## System
### 1. 시스템 개요

- **주요 기능** : 영화, 도서, 게임 등의 미디어에 대한 정보 및 평점을 평론가에게 제공 및 사용자의 성향에 따른 추천 시스템 구축
- **사용자 역할 (Role)** : 비회원 (제한된 기능), 회원 (일반적인 기능), 관리자 (관리 기능)
- **주요 유스케이스** : 회원 관리 (회원 가입 및 로그인), 미디어 (CRUD), 평점 분석 (python library 를 통한 자체 개발), 평가 작성 (회원에 한하여 미디어에 대한 평가 작성), 관리자 기능 (정책을 위반하는 평가, 회원 등에 대한 삭제 및 수정 권한)
- **추천 시스템** : MVP 구조 완성 이후 python 계열로 직접 생성 및 적용
- **비기능 목표 수치**
    - API : p95 < 200ms - 오류율 (테스트 : 0% 기준)
        - 실행 후 엔드포인트 별로 분류할 것
    - Nest Interceptor & Logger 사용하여 측정

---

### 2. 시스템 구성 요소

- **Frontend** : Next.js (App Router), TypeScript
- **Backend** : NestJS (Controller, Service, Repository) - Prisma를 기본값으로 사용, 필요 시 확장
- **Database** : PostgreSQL, Prisma (ORM)
- **Etc** : Redis (Cache & Rate Limit)

---

### 3. Application Architecture

- **Layered**
    - **Controller** : 인증 및 인가, DTO 검증, 라우팅
    - **Service** : 트랜잭션 시작 및 관리, 도메인 규칙 (제한 사항) 적용 등의 로직 담당
    - **Data (Repository)**  : PrismaService 사용
- **Module**
    - Auth, User, Rating 등 모듈화 하여 관리
- **Validation**
    - **Request** : DTO & class-validator
    - **Domain** : 시스템 규칙 (ex : 1명의 사용자가 특정 미디어에 대하여 1개 초과의 평가 작성 불가) 적용
- **Error Handling**
    - **AppFilter** : 모든 예외를 필터링 하여 JSON 형식으로 파싱 - 에러 응답 포맷 통일

        ```json
        {
        	"success": false,
        	"error": {
        		"code": "USER_ALREADY_EXISTS",
        		"reason": "이미 존재하는 사용자입니다.",
        		"status": 409,
        		"details": { "user_id": 1 },
        	},
        	"requestId": "1",
        	"path": "/auth/signup",
        	"method": "POST",
        	"timestamp": "2025-09-23T00:00:00Z",
        }
        ```

- **API** : RESTful + 추후 필요 시 확장
    - 확장성 및 추후 관리를 위해 버전명 명시
        - v1/auth/signup 등의 경로 사용
- **Authorization** : JWT 관리 및 Role Guard 적용
    - JWT
        - AccessToken : 15m, 저장 X
        - RefreshToken: 3d, 해싱하여 테이블로 관리
- **Transaction**
    - 모든 트랜잭션은 Service Layer에서 호출 및 관리
- Cache
    - Redis에 Cache 저장을 통해 TTL (Time To Live) 기간 동안 재호출 방지
    - 읽기 : 캐시 조회 → 데이터 없을 시 DB 조회 및 set(TTL) : 커밋 후 DELETE
    - 모든 작업 후 Key 삭제

---

### 4. Data Architecture

- **User**
    - id (PK): Number
    - email (unique): String
    - password_hash: String - 해싱하지 않은 값 저장 X
    - role: string - UserRole (ADMIN | USER)
    - status: UserStatus
    - name: String
    - name_normalized: String - name 값을 trim().toLower() 적용하여 검색에 사용
    - tag: Number - # + n개의 숫자 (name_normalized + tag 값은 unique)
    - image_url?: String
    - created_at, updated_at: DateTime
    - @unique(name_normalized, tag) - name + tag 조합은 유일성을 만족해야함

- Media
    - id (PK): Number
    - type: Enum(Game, Movie, Book)
    - title: String
    - description: String
    - year: Number
    - image_url?: String - 크기 지정 및 잘라내기 필요
    - meta: json { type 별로 필요한 데이터 담기 }
    - created_at, updated_at: DateTime
    - @index([title, type])

- Rating
    - id (PK): Number
    - user_id (FK): Number
    - media_id (FK): Number
    - score: Number - 값 범위 제한 필요
    - comment?: String - 프런트엔드 처리 시 null 인 경우 표시되는 부분 다르게 표현
    - created_at, updated_at: DateTime
    - @unique(user_id, media_id) - 특정 미디어에 대한 User의 Rating은 하나만 존재 가능

- Aggregation (집계용 테이블 - 매번 sum(), avg() 등 호출 시 성능 저하 우려)
    - media_id(PK, FK): Number
    - avg_score: Number
    - rating_count: Number
    - last_calculated: DateTime - 일정 시간 주기로 특정 기간 내의 미디어 갱신

- RefreshToken
    - id (PK): Number
    - user_id (FK): Number
    - token_hash: String - 탈취 방지를 위한 해싱
    - ip - UserAgent
    - expires_at: DateTime - 만료 시간
    - revoked: Boolean - 로그아웃 등 강제로 토큰 만료
    - created_at: DateTime

---

### 5. Network Architecture

- 기본적으로 자체 크롤링 데이터 및 메서드 사용
- 추후 확장 시 IMDB 등의 API 키 발급받아 사용
- CORS 사용으로 브라우저 제어
- MVP 구조 확정 후 확장 시 재 설정 및 설계 필요
- /health (미정) 엔드포인트 생성 후 health check

### 6. 확장 가능 기능

- API 사용 등으로 빅데이터 사용
- 데이터 분석 기능 탑제
- 사용자 개인 페이지 생성하여 스레드 형식으로 사용자의 평가 조회 가능
- 비회원 조회 기능
- 선택한 리스트 xls 파일로 export
---

## Development Environment
### 1. Middleware

#### Database & ORM

- Database : PostgreSQL
    - NoSQL 계열에 비하여 정형화된 형태가 필요하고 PostgreSQL 에서 JSONB 타입을 지원하기에 NoSQL 계열의 장점을 살리기 어렵다고 판단
- Object Relational Mapping
    - Prisma
    
---

### 2. Framework & Language- 버전 확정 시 명시할 것

- Node.js v22 (Runtime)
- NestJS v11.0.1 (Backend)
    - Node.js 계열 백엔드 개발 프레임워크이며 Layered Architecture 기반의 구조 및 Module 시스템을 활용하기 위하여 선택
- Next.js (Frontend)
    - React 기반으로 사용 가능하며 vercel 을 통하여 배포 및 관리가 용이하여 선택
---
### 3. Package Manager

- pnpm v10.15.1
    - Next.js 권장
---
### 4. Code Style

- ESLint & Prettier 사용
---
### 5. Log

- Pino
    - JSON 구조 로그 및 경량화 Winston과 비교해 Local 및 MVP 구조 개발에 적합하다 판단
    - redact key : authorization, cookie
---
### 6. API Documents

- Nest Swagger - 개발 환경에서만 노출
---
### 7. Env

- dotenv 사용 및 .env.dev / .env.test 등으로 구분하여 사용할 것

---

## Security
### 1. 자산 및 데이터 분류

- 데이터 등급
    - P0 (민감) : password_hash, refresh_token_hash 등
    - P1 (개인) : email, name (user), image_url 등
    - P2 (일반) : 비회원 조회가 가능한 점수 및 평가 등
---
### 2. 아키텍처 & 신뢰 경계

- 경계 : Browser ↔ API / API ↔ DB/Redis
- 최종적으로 port에는 api 만 노출시킬 것
---
### 3. 인증 & 인가 및 토큰 관리

- 인증
    - email & password (hash 및 검증)
- Token (JWT)
    - Access Token : 15m / Client Authorization 헤더로 전송, 저장 X
    - Refresh Token : 3d / DB에 해시 저장, 응답 시 HttpOnly 쿠키 사용
- 회전 및 폐기
    - 재발급 시 이전 Refresh Token 무효화
    - 강제 로그아웃 (관리자 권한)
- 인가
    - RBAC (Role Based Access Control) : ADMIN, USER / 사용자의 평가 등 리소스에 대한 소유권 검증
---
### 4. 입력 및 출력 보안

- 입력
    - DTO & class-validator 사용으로 입력 데이터 검증
- 도메인 규칙
    - 1 User는 1 Media에 대한 Rating을 1개만 작성할 수 있음
- 출력
    - 에러 응답 표준화 (민감 정보 노출 X) 를 통한 로그 노출 방지
---
### 5. 전송 및 저장

- 실제 서비스 시 HTTPS 프로토콜로 변경할 것
- 저장
    - Token, Password 저장 시 평문 저장 금지
- 로그
    - Token, Cookie, Password 등의 민감 정보 로그 노출 금지
---
### 6. 어플리케이션 보안

- code / reason / status / requestId / timestamp(Z)
- CORS
    - origin: [] 명시를 통해 백엔드, 프런트엔드의 통신 허용
- 보안 Header
    - helmet 사용
- Rate Limit 설정으로 무차별 요청 공격 대비
---
### 7. Secret 및 Key 관리

- .env.test / .env.dev / .env 등으로 환경 변수 관리
- dotenv-safe 설정 등을 통한 값 확인
- JWT_SECRET 키 길이 설정
---
### 8. 로깅

- Pino 및 JSON 구조화하여 사용
---

## Test Strategy
### 1. 테스트 전략

- Unit (단위) : 규칙 및 분기 (Service, Guard, Pipe), Fast and Isolation, Mock and Stub
- Integration (통합) : Postgres & Redis 트랜잭션 및 제약, 캐시 동작 검증
- E2E (End to End) : Nest TestingModule + Supertest - 전체 흐름
- 보안 : 인증/인가 장치 우회, RateLimit, Error 정보 노출
---
### 2. 테스트 환경

- Node.js 22
- pnpm
- Jest (Unit, Integration, E2E) - 3가지로 분리
- supertest (E2E) - 메모리 실행 후 HTTP 레벨에서 검증
- Pino - Logger
---
### 3. 품질

- Unit Coverage ≥ 80%
- E2E 5xx = 0%
- p95 < 200ms
---
### 4. 공통

- CORS : 허용 origin 만 응답, 금지 origin 브라우저 차단 확인
- Logging : 요청 단위에 requestId 포함 여부, 민감 정보 누락 확인
---


#### 진행 내역
|       날짜       |                     내역                     |                                    비고                                     |                                                      추가 사항                                                      |
|:--------------:|:------------------------------------------:|:-------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------:|
|     09/02      |                프로젝트 생성 및 설정                |                          nest.js & next.js 사용 예정                          |                                             pnpm package manager 사용                                             |
|     09/03      |               DB 설치 및 스키마 작성               |                          PostgreSQL & Prisma 사용                           |                                               User 서비스, 컨트롤러 작성 中                                               |
|     09/04      |         User 관련 메서드 및 dto 작성 및 수정          |                         findAll() 관련 dto 추가 및 수정                          |                                             User 서비스, 컨트롤러 1차 작성 완료                                             |
|     09/05      |                  코드 주석 수정                  |                                   주석 수정                                   |                                              User 계열 메서드 등의 주석 수정                                               |
|     09/06      |          Media & UserRating 모델 생성          |                        find-media.query.dto 까지 생성                         | users/dto 파일 명 리팩터링, find-media.query.dto 파일 생성 및 작성 중 gpt의 도움을 받으려 했으나 무능한 관계로 임시로 type: string 처리 해둠 추후 수정할 것 |
|     09/07      |     Media dto 및 service find 계열 메서드 생성     |                       create, update, remove 작성 필요                        |                     generated/ 경로 제거 후 '@prisma/client' 계열로 통일 - schema.prisma 에서 output 제거                     |
|   09/07 - 2    |        Media 계열 서비스 컨트롤러 필수 메서드 완성         |                       create, update, remove 작성 완료                        |                                           UserRating 작성 및 추가 기능 추가 필요                                           |
|   09/07 - 3    |        Rating 계열 서비스, 컨트롤러, dto 작성         |                       MVP 구조에 필요하다고 생각된 모델 들 구현 완료                        |                                            모델 수정 및 테스트, 추가 기능 구현 필요                                             |
|     09/08      |         schema 수정 - auth 관련 기능 생성          |                             추후 OAuth 추가하고 싶음                              |                                        인증 관련 추가 사항이나 유의점, 기업 들의 사례 찾아보기                                         |
|   09/08 - 2    |          auth module 작성 및 테스트 완료           |                        user 디렉터리의 create() 제거? 필요성                        |                                400 BadRequest가 응답으로 돌아오는 경우가 있음, 데커레이터 정보 찾아볼 것                                 |
|     09/09      |      Rating 관련 메서드에 jwt AuthGuard 적용       |                   create, update, delete 에 대하여 전체 적용할 것                   |                                                                                                                 |
|   09/09 - 2    |             Rating 계열 메서드 리팩터링             |                 @Req() 를 통해 req 객체를 받아와 userId 검증 방식으로 변경                 |                                                                                                                 |
|     09/10      |     User 의 findMe() 메서드 제공 및 jwt 인증 추가     |                                                                           |                                                                                                                 |
|     09/11      |       Media의 조회 부분에서 Rating 관련 인증 추가       |           사용자 로그인한 상태일 경우 myRating 으로 해당 사용자의 해당 미디어에 대한 평가 출력            |          트랜잭션 관리를 어떻게 해야할지 생각할 것, agg와 myRating 관리 부분에서 myRating에게 null을 주며 동시에 agg와 트랜잭션으로 묶을 수는 없을까?          |                                                
|     09/12      |      NestSwagger를 이용하여 엔드포인트 명세 자동 생성      |                      @ApiProperty() 데커레이터로 추가 정보 작성                       |                                     excel 등의 도구 사용보다 편리한 듯, 추가로 오류 여부 확인 필요                                     |
|   09/12 - 2    |               CORS, 보안 헤더 적용               |                              Helmet 미들웨어 사용                               |                                                                                                                 |
|   09/12 - 3    |       Rate 제한 및 health Controller 생성       |                      n분당 m개의 요청 허용 등의 제한으로 악의적 공격 대비                      |                                                                                                                 |
|     09/13      | RequestIdMiddleware, LoggingInterceptor 작성 |                      로깅에 필요한 정보, 요청 id 확인 이유 등등 알아보기                      |                                                                                                                 |
|     09/14      |         Exception Response to Json         |                            모든 에러를 JSON 형식으로 파싱                            |                          기존 orm-exception.ts 파일도 filter 파일에 통합 혹은 리팩터링 가능(?), 가능하다면 진행                          |
|     09/15      |          User 관련 부분 Auth 모듈로 리팩터링          |                      AccessToken, RefreshToken 관리 분리                      |                                 Redis 등의 경량 DB를 사용하여 사용자 세션을 따로 관리하는 것이 좋을 것 같음                                 |
|     09/16      |     UsersController 및 UsersServices 수정     |    생성(회원 가입) 및 로그인 기능 auth 모듈로 분리 후 users 에서는 사용자 개인이 수정하게 될 데이터 등을 담음    |                                         updatePassword, updateProfile 등                                         |
|     09/17      |            RatingsController 수정            |                    RatingsService 수정에 따른 Controller 수정                    |                                                                                                                 |
|     09/18      |                  Genre 추가                  |                            Media 테이블에 genre 추가                            |                                                                                                                 |
|     09/19      |              몇가지 오류 수정 및 테스트               |                 Dto를 통한 UserServices 동작 확인 및 DB 내부 확인 완료                  |                                                      확장 가능                                                      |
|     09/20      |               frontend init                |                     next.js를 통한 프런트엔드 디렉터리 및 프로젝트 생성                      |                                                                                                                 |
|     09/21      |         frontend - types.ts 몇가지 추가         |                         backend 부분과의 연동을 위한 파일 수정                         |                                                                                                                 |
|     09/22      |                  전면 리팩터링                   |                         재 설계 및 기능 명세 재정의 후 다시 할 것                         |                                                                                                                 |
|   09/22 - 2    |                 시스템 설계서 작성                 |                             시스템 아키텍처 설계 작성 중                              |                                                                                                                 |
| 09/23 to 09/27 |    media-critic 설계서 v0 작성 완료 및 프로젝트 설정     |                                                                           |                                                                                                                 |
|   09/27 - 2    |                Backend init                |               NestJS v11 project 생성 및 schema.prisma 파일 작성 중               |                                                                                                                 |
|     09/28      |              schema.prisma v0              |            schema.prisma 파일에 User 외 Media, Rating 등 사용할 모델 정의             |                                            TODO: migrate & generate                                             |
|   09/28 - 2    |             main.ts Bootstrap              |                  프로젝에 필요한 설정 및 파이프, 필터 등 main.ts 내부에 작성                   |                                               .env.* 내부 노출 절대 주의                                                |
|     09/29      |              app.module.ts 작성              |   app.controller.ts, app.service.ts 파일 제거 및 app.module.ts 내부에 사용할 모듈 설정   ||
|   09/29 - 2    |              /prisma 경로 초기 작성              |    prisma.module.ts, prisma.service.ts 및 app.module.ts 내부에서 prisma 주입     ||
|     09/30      |           auth경로의 strategy 파일 작성           |                    auth/strategies/jwt.strategy.ts 수정                     ||
|     10/01      |            jwt-auth.guard.ts 작성            | 내부 any 타입 및 throw 할 Error Message 통일화 필요 (guard에서 할지 Filter 만들어서 처리할지 결정) ||
|   10/01 - 2    |  JwtAuthGuard 전역 적용 및 Public 커스텀 데코레이터 생성  |                 전역 보호 후 공개가능 API @Public() 적용하여 요청 허용 할 것                 ||
|   10/01 - 3    |        LoginDto 작성 및 AuthModule 정비         |                             Auth 다음 단계로 넘어갈 것                             ||
|     10/02      |              ErrorFilter Init              |                      Error 표준 JSON 재 점검 및 전체 재작성 할 것                      ||
|     10/03      |  Auth Controller & Service Skeleton init   |               Login 기능 작성 완료 -> User 코드 완료 후 주석 풀고 테스트 할 것                ||
|     10/04      |               오타 수정 및 주석 해제                |                                                                           ||
|     10/05      |         Auth Module Register 기능 작성         |       Controller @Post('register) 경로 라우트 및 Service register 메서드 생성        ||
|     10/06      |                    ...                     |                             OAuth 인증방식 추가할 것                              ||
---

#### 추가 사항
|                                                 문제                                                  |             해결법             |                                상황                                |비고|
|:---------------------------------------------------------------------------------------------------:|:---------------------------:|:----------------------------------------------------------------:|:-:|
|                                      dto가 굳이 필요한가 싶은 부분들이 존재함                                       |       아키텍쳐 관련 자료 찾아보기       |                                X                                 ||
|                     컨트롤러와 서비스 통신에서 dto를 중복으로 import 하는데 이 부분을 하나로 해결할 가능성이 있는가?                     |       코드 작성 및 추후 테스트        |                                X                                 ||
| ratings 관련 부분의 DB 저장명 UserRating과 nestjs 코드에서의 ratings 둘의 이름을 통일해야 하는가? 통일해야 한다면 어떠한 이름이 더 좋은 이름일까? |   github 등에서 여러 코드 구경해보기    |                                X                                 ||
|   ratings 부분의 코드들 중 mediaId와 userId를 체크할 지, 그 전 요청 단계에서 토큰이나 세션 등의 검증을 거치고 ratingId를 바로 호출할 지 여부    |    database 및 보안 관련 학습하기    |                                X                                 ||
|                                    mapOrmError() 메서드가 필요한게 맞을까?                                     | 예외 처리 및 prisma docs 자료 찾아보기 |                                X                                 ||
|       회원 가입 시 토큰 발급 후 자동 로그인, 회원 가입 후 가입 정보를 자동으로 login 메서드에 넘겨 토큰을 발급 받는 방식 어느 방식이 더 좋은 방식?        |         테스트 및 자료 찾기         |            MVP 구조 특성 상 가입 후 자동 로그인으로 구현 후 추후 재 고려할 것             ||
|                          proxy, rate, CORS, healthController의 존재 이유는 무엇인가?                          |             학습              | 형식적인 존재 이유가 아닌 실무적인 부분에서 존재해야하는 이유와 다른 방식으로 접근할 수는 없는 지 등등도 찾아보기 ||
|            프로젝트와 직접 연관은 없지만 node.js 계열에서 자주 보이는 webpack 이란 무엇이며 왜 사용하고, 어떠한 대체 수단이 있는가?             |                             |                                                                  ||
|                                     Promise.all 자주 보이는 메서드 파해치기                                     |                             |                                                                  ||
|               세션, 쿠키를 동시에 사용? 혹은 하나만 사용할 경우 등의 이점은 무엇이며 token 세션이 아닌 다른 세션 관리 방법도 존재?               |                             |                                                                  ||
|                                 payload의 사용 이유와 sub 이라는 이름을 사용하는 이유                                 |                             |                                                                  ||
|                 /ratings/rating.service.ts -> findAll() -> WHITELIST 부분 더 나은 이름 찾기                  |                             |                                                                  ||
|         isFinite() 메서드는 무엇?, prisma를 통해 select 구문을 전달 할 때 mode: 'insentive' 부분이 의미하는 바는 무엇?         |                             |                                                                  ||
|                                         next.js 구조 다시 확인하기                                          |                             |                                                                  ||
