## media-critic-alpha (Multimedia Critic Web System)

#### 사용 기술

|     기술     |            용도             |      버전       |
|:----------:|:-------------------------:|:-------------:|
|  node.js   |          node.js          | 22.14.0 (LTS) |
| typescript |   programming language    |     5.9.2     |
|   eslint   |    dev only dependency    |    9.34.0     |
|  prettier  |    dev only dependency    |     3.6.2     |
|    pnpm    |      package manager      |    10.15.1    |
|  nest.js   |     backend framework     |    11.0.1     |
|  swagger   |       api document        |    11.2.0     |
| postgresql |         database          |    17.6.1     |
|   prisma   | object relational mapping |    6.15.0     |


---

#### 진행 내역
|    날짜     |                     내역                     |                                 비고                                  |                                                      추가 사항                                                      |
|:---------:|:------------------------------------------:|:-------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------:|
|   09/02   |                프로젝트 생성 및 설정                |                       nest.js & next.js 사용 예정                       |                                             pnpm package manager 사용                                             |
|   09/03   |               DB 설치 및 스키마 작성               |                       PostgreSQL & Prisma 사용                        |                                               User 서비스, 컨트롤러 작성 中                                               |
|   09/04   |         User 관련 메서드 및 dto 작성 및 수정          |                      findAll() 관련 dto 추가 및 수정                       |                                             User 서비스, 컨트롤러 1차 작성 완료                                             |
|   09/05   |                  코드 주석 수정                  |                                주석 수정                                |                                              User 계열 메서드 등의 주석 수정                                               |
|   09/06   |          Media & UserRating 모델 생성          |                     find-media.query.dto 까지 생성                      | users/dto 파일 명 리팩터링, find-media.query.dto 파일 생성 및 작성 중 gpt의 도움을 받으려 했으나 무능한 관계로 임시로 type: string 처리 해둠 추후 수정할 것 |
|   09/07   |     Media dto 및 service find 계열 메서드 생성     |                    create, update, remove 작성 필요                     |                     generated/ 경로 제거 후 '@prisma/client' 계열로 통일 - schema.prisma 에서 output 제거                     |
| 09/07 - 2 |        Media 계열 서비스 컨트롤러 필수 메서드 완성         |                    create, update, remove 작성 완료                     |                                           UserRating 작성 및 추가 기능 추가 필요                                           |
| 09/07 - 3 |        Rating 계열 서비스, 컨트롤러, dto 작성         |                    MVP 구조에 필요하다고 생각된 모델 들 구현 완료                     |                                            모델 수정 및 테스트, 추가 기능 구현 필요                                             |
|   09/08   |         schema 수정 - auth 관련 기능 생성          |                          추후 OAuth 추가하고 싶음                           |                                        인증 관련 추가 사항이나 유의점, 기업 들의 사례 찾아보기                                         |
| 09/08 - 2 |          auth module 작성 및 테스트 완료           |                     user 디렉터리의 create() 제거? 필요성                     |                                400 BadRequest가 응답으로 돌아오는 경우가 있음, 데커레이터 정보 찾아볼 것                                 |
|   09/09   |      Rating 관련 메서드에 jwt AuthGuard 적용       |                create, update, delete 에 대하여 전체 적용할 것                |                                                                                                                 |
| 09/09 - 2 |             Rating 계열 메서드 리팩터링             |              @Req() 를 통해 req 객체를 받아와 userId 검증 방식으로 변경              |                                                                                                                 |
|   09/10   |     User 의 findMe() 메서드 제공 및 jwt 인증 추가     |                                                                     |                                                                                                                 |
|   09/11   |       Media의 조회 부분에서 Rating 관련 인증 추가       |        사용자 로그인한 상태일 경우 myRating 으로 해당 사용자의 해당 미디어에 대한 평가 출력         |          트랜잭션 관리를 어떻게 해야할지 생각할 것, agg와 myRating 관리 부분에서 myRating에게 null을 주며 동시에 agg와 트랜잭션으로 묶을 수는 없을까?          |                                                
|   09/12   |      NestSwagger를 이용하여 엔드포인트 명세 자동 생성      |                   @ApiProperty() 데커레이터로 추가 정보 작성                    |                                     excel 등의 도구 사용보다 편리한 듯, 추가로 오류 여부 확인 필요                                     |
| 09/12 - 2 |               CORS, 보안 헤더 적용               |                           Helmet 미들웨어 사용                            |                                                                                                                 |
| 09/12 - 3 |       Rate 제한 및 health Controller 생성       |                   n분당 m개의 요청 허용 등의 제한으로 악의적 공격 대비                   |                                                                                                                 |
|   09/13   | RequestIdMiddleware, LoggingInterceptor 작성 |                   로깅에 필요한 정보, 요청 id 확인 이유 등등 알아보기                   |                                                                                                                 |
|   09/14   |         Exception Response to Json         |                         모든 에러를 JSON 형식으로 파싱                         |                          기존 orm-exception.ts 파일도 filter 파일에 통합 혹은 리팩터링 가능(?), 가능하다면 진행                          |
|   09/15   |          User 관련 부분 Auth 모듈로 리팩터링          |                   AccessToken, RefreshToken 관리 분리                   |                                 Redis 등의 경량 DB를 사용하여 사용자 세션을 따로 관리하는 것이 좋을 것 같음                                 |
|   09/16   |     UsersController 및 UsersServices 수정     | 생성(회원 가입) 및 로그인 기능 auth 모듈로 분리 후 users 에서는 사용자 개인이 수정하게 될 데이터 등을 담음 |                                         updatePassword, updateProfile 등                                         |
|   09/17   |            RatingsController 수정            |                 RatingsService 수정에 따른 Controller 수정                 ||
|   09/18   |                  Genre 추가                  |                         Media 테이블에 genre 추가                         ||

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
|            프로젝트와 직접 연관은 없지만 node.js 계열에서 자주 보이는 webpack 이란 무엇이며 왜 사용하고, 어떠한 대체 수단이 있는가?             ||                                                                  ||
|                                     Promise.all 자주 보이는 메서드 파해치기                                     ||                                                                  ||
|               세션, 쿠키를 동시에 사용? 혹은 하나만 사용할 경우 등의 이점은 무엇이며 token 세션이 아닌 다른 세션 관리 방법도 존재?               ||                                                                  ||
|                                 payload의 사용 이유와 sub 이라는 이름을 사용하는 이유                                 ||||
|                 /ratings/rating.service.ts -> findAll() -> WHITELIST 부분 더 나은 이름 찾기                  ||||
|         isFinite() 메서드는 무엇?, prisma를 통해 select 구문을 전달 할 때 mode: 'insentive' 부분이 의미하는 바는 무엇?         ||||