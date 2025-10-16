export declare class PasswordService {
    hash(pw: string): Promise<string>;
    verify(hash: string, pw: string): Promise<boolean>;
}
