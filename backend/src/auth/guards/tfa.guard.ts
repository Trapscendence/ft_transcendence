import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { PASS_TFA_GUARD_KEY } from '../decorators/pass-tfa-guard.decorator';

@Injectable()
export class TfaGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const passTotp = this.reflector.getAllAndOverride<boolean>(
      PASS_TFA_GUARD_KEY,
      [context.getHandler(), context.getClass],
    );
    if (passTotp) return true;

    // Check session.totp_secret
    let session: any;
    if (context.getType() === 'http') {
      session = context.switchToHttp().getRequest()?.session;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      session = GqlExecutionContext.create(context).getContext()?.req?.session;
    } else {
      throw new InternalServerErrorException(
        `Unknown context type: ${context.getType()}`,
      );
    }

    if (session === undefined) return false;
    else return !session.tfa_secret;
  }
}
