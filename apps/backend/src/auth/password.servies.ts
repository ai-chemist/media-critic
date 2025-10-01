import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
    hash(pw: string) { return argon2.hash(pw, { type: argon2.argon2id }); }
    verify(hash: string, pw: string) { return argon2.verify(hash, pw); }
}