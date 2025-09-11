declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<{
        userId: number;
        email: string;
    }>;
}
export {};
