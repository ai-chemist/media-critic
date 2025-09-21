// Backend 스키마 기반으로 타입 설정할 파일

export type Media = {
    id: number;
    title: string;
    type: string;
}

export type UserRating = {
    id: number;
    score: number;
    comment: string;
}

export type User = {
    id: number;
    email: string;
    username: string;
}