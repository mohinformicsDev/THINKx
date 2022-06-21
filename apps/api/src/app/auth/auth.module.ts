import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../environments/environment';
import { EncryptionModule } from '../encryption/encryption.module';
import { CustomerModule } from '../features/customer/customer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminStrategy } from './strategies/admin.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        AdminStrategy
    ],
    imports: [
        CustomerModule,
        PassportModule,
        JwtModule.register({
            secret: environment.jwtConstants.secret,
            signOptions: { expiresIn: '1y' },
        }),
        EncryptionModule
    ],
    exports: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        AdminStrategy
    ]
})
export class AuthModule { }
