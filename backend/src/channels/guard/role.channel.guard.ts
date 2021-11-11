import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DatabaseService } from 'src/database/database.service';
import { schema } from 'src/utils/envs';

@Injectable()
export class ChannelRoleGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = GqlExecutionContext.create(context).getContext().req;
    const session = req.session;

    req.channel_role = await this.databaseService.executeQuery(`
      SELECT
        channel_role
      FROM
        ${schema}.channel_user
      WHERE
        user_id = ${session.uid};
    `);
    return req.channel_role ? true : false;
  }
}
