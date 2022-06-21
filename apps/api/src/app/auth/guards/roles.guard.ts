import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../models/roles.decorator';
import { Role } from '../../models/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        this.logger.log(requiredRoles, 'required Roles')
        const { user } = context.switchToHttp().getRequest();
        this.logger.log(user, "user details");

        return requiredRoles.some((role) => user?.roles?.includes(role));
    }
}