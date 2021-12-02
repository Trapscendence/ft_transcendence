import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GamesService } from 'src/games/games.service';
import { DatabaseService } from 'src/database/database.service';
import { PUB_SUB } from 'src/pubsub.module';
import { UserStatus } from 'src/users/models/user.model';
import { env } from 'src/utils/envs';

@Injectable()
export class StatusService {
  // User ID -> sid, status
  private readonly statusContainer: Map<
    string,
    { sid: string; status: UserStatus }
  >;

  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly databaseService: DatabaseService,
    private readonly gamesService: GamesService,
  ) {
    this.statusContainer = new Map<
      string,
      { sid: string; status: UserStatus }
    >();
  }

  setStatus(userId: string, status: UserStatus): void {
    if (status === UserStatus.OFFLINE)
      throw `Invalid usage: Cannot change user(id: ${userId}) status to ${status} with setStatus)`;
    const statusObject = this.statusContainer.get(userId);
    if (!statusObject) throw `The user(id: ${userId}) is offline`;
    else statusObject.status = status;
    this.pubSub.publish(`status_of_${userId}`, { statusChange: status });
  }

  getStatus(userId: string): UserStatus {
    return this.statusContainer.get(userId)?.status ?? UserStatus.OFFLINE;
  }

  async newConnection(userId: string, sid: string): Promise<void> {
    if (this.statusContainer.has(userId)) await this.deleteConnection(userId);
    this.pubSub.publish(`status_of_${userId}`, {
      statusChange: UserStatus.ONLINE,
    });
    this.statusContainer.set(userId, {
      sid,
      status: UserStatus.ONLINE,
    });
  }

  async deleteConnection(userId: string): Promise<void> {
    if (!userId) return;
    const statusObject = this.statusContainer.get(userId);
    if (!statusObject) return;

    this.gamesService.surrenderGameWithUserId(userId);
    await this.databaseService.executeQuery(
      `DELETE FROM ${env.database.schema}.user_session WHERE sid = '${statusObject.sid}' RETURNING sid;`,
    );
    this.statusContainer.delete(userId);
    this.pubSub.publish(`status_of_${userId}`, {
      statusChange: UserStatus.OFFLINE,
    });
  }
}
