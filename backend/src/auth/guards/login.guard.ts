import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { PASS_LOGIN_GUARD_KEY } from '../decorators/pass-login-guard.decorator';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const passLogin = this.reflector.getAllAndOverride<boolean>(
      PASS_LOGIN_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (passLogin) return true;

    // Check session.uid
    if (context.getType() === 'http') {
      return !!context.switchToHttp().getRequest()?.session?.uid;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      return !!GqlExecutionContext.create(context).getContext()?.req?.session
        ?.uid;
    } else {
      throw new InternalServerErrorException(
        `Unknown context type: ${context.getType()}`,
      );
    }
  }
}
