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
| postgresql |         database          |    17.6.1     |
|   prisma   | object relational mapping |    6.15.0     |


---

#### 진행 내역
|  날짜   |            내역             |             비고             |                                                      추가 사항                                                      |
|:-----:|:-------------------------:|:--------------------------:|:---------------------------------------------------------------------------------------------------------------:|
| 09/02 |       프로젝트 생성 및 설정        |  nest.js & next.js 사용 예정   |                                             pnpm package manager 사용                                             |
| 09/03 |      DB 설치 및 스키마 작성       |   PostgreSQL & Prisma 사용   |                                               User 서비스, 컨트롤러 작성 中                                               |
| 09/04 | User 관련 메서드 및 dto 작성 및 수정 |  findAll() 관련 dto 추가 및 수정  |                                             User 서비스, 컨트롤러 1차 작성 완료                                             |
| 09/05 |         코드 주석 수정          |           주석 수정            |                                              User 계열 메서드 등의 주석 수정                                               |
| 09/06 | Meida & UserRating 모델 생성  | find-media.query.dto 까지 생성 | users/dto 파일 명 리팩터링, find-media.query.dto 파일 생성 및 작성 중 gpt의 도움을 받으려 했으나 무능한 관계로 임시로 type: string 처리 해둠 추후 수정할 것 |