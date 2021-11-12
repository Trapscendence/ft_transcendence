import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    } else if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();

      if (ctx.authorization) {
        return { headers: { authorization: ctx.authorization } };
      } else if (ctx.req) {
        return ctx.req;
      } else {
        throw `What?`;
      }
    } else {
      throw `Unexcepted context type: ${context.getType()}`;
    }
  }
}
