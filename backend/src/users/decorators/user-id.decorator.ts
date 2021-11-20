import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

export const UserID = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user.id;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req.user.id;
      // const token = GqlExecutionContext.create(context)
      //   .getContext()
      //   .req.headers.authorization.split(' ')[1];
      // return verify(token, process.env.JWT_SECRET);
    }
  },
);
