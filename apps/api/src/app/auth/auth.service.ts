import { Injectable, Logger } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../encryption/encryption.service';
import { CustomerService } from '../features/customer/customer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: CustomerService,
    private readonly jwtService: JwtService,
    private encrpytionService: EncryptionService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    // const compareResult = await this.encrpytionService.compare(
    //   pass,
    //   user.password
    // );
    // if (user && compareResult) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return user;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      roles: [user.roles],
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
