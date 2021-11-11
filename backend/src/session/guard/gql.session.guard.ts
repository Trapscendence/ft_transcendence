import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // return true;
    // console.log('-_-', context);

    const req = GqlExecutionContext.create(context).getContext().req;
    console.log(req);
    const session = req.session;

    if (session.uid === undefined) {
      return false;
    } else {
      return true;
    }
  }
}
