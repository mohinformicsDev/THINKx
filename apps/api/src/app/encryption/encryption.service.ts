import { hash, compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { environment } from '../../environments/environment';

@Injectable()
export class EncryptionService {
  constructor() {}
  async hash(plain: string): Promise<string> {
    return hash(plain, environment.hashRounds);
  }
  async compare(plain: string, encrypted: string): Promise<boolean> {
    return compare(plain, encrypted);
  }
}
