import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const UserID = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let uid: string;

    if (context.getType() === 'http') {
      uid = context.switchToHttp().getRequest().session.uid;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      console.log(GqlExecutionContext.create(context).getContext().req.headers);
      uid = GqlExecutionContext.create(context).getContext().req.session.uid;
    }
    console.log(GqlExecutionContext.create(context).getContext().req.session);
    if (uid === undefined) throw new UnauthorizedException();
    else return uid;
  },
);
