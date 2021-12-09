import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { SITE_ROLES_KEY } from '../decorators/site-roles.decorator';
import { UserRole } from '../models/user.model';
import { UsersService } from '../users.service';

@Injectable()
export class SiteRoleGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext & { req: any },
  ): Promise<boolean> {
    const requiredRoles: UserRole[] = this.reflector.get<UserRole[]>(
      SITE_ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    let session: { uid: string };
    if (context.getType() === 'http') {
      session = context.switchToHttp().getRequest().session;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      session = GqlExecutionContext.create(context).getContext().req.session;
    } else {
      throw `Unexpected context type: ${context.getType()}`;
    }

    const userSiteRole: UserRole = await this.usersService.getSiteRole(
      session.uid,
    );

    for (const requiredRole of requiredRoles) {
      if (requiredRole === UserRole.OWNER && userSiteRole !== UserRole.OWNER)
        return false;
      else if (
        requiredRole === UserRole.ADMIN &&
        userSiteRole === UserRole.USER
      )
        return false;
    }
    return true;
  }
}
