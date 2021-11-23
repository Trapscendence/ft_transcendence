import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const UserID = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let id;
    if (context.getType() === 'http') {
      id = context.switchToHttp().getRequest().user.id;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      id = GqlExecutionContext.create(context).getContext().req.user.id;
    }
    if (id === undefined)
      throw new UnauthorizedException('User id is undefined.');
    return '' + id;
  },
);
