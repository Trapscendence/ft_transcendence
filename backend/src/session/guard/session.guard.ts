import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const session: Record<string, any> = context
      .switchToHttp()
      .getRequest().session;

    console.log(session.id);

    if (session.uid === undefined) {
      return false;
    } else {
      return true;
    }
  }
}
