export class UserProfileDto {
    id: number;
    email: string | null;
    name: string;
    tag: string;
    imageUrl: string | null;
    createdAt: Date;
}