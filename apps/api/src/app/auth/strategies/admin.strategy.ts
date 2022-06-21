import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { environment } from 'apps/api/src/environments/environment';
import { Strategy } from 'passport-local';
import { EncryptionService } from '../../encryption/encryption.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  private readonly logger = new Logger(AdminStrategy.name);

  constructor(private readonly encService: EncryptionService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.log(username, ' username: ');
    this.logger.log(password, ' password: ');
    const admin = environment.admin;
    const compareResult = await this.encService.compare(
      password,
      admin.password
    );
    this.logger.log(compareResult, 'compareResult');
    if (username == admin.username && compareResult) {
      return { username, roles: 'admin' };
    }
    throw new UnauthorizedException();
  }
}
