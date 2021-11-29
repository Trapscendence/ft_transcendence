import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
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

  // Websocket Key -> User ID
  private readonly webSocketKeyContainer: Map<string, { userId: string }>;

  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly databaseService: DatabaseService,
  ) {
    this.statusContainer = new Map<
      string,
      { sid: string; status: UserStatus }
    >();
    this.webSocketKeyContainer = new Map<string, { userId: string }>();
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

  newConnection(webSocketKey: string, userId: string, sid: string): void {
    if (this.statusContainer.has(userId)) this.deleteConnection(webSocketKey);
    this.pubSub.publish(`status_of_${userId}`, {
      statusChange: UserStatus.ONLINE,
    });
    this.statusContainer.set(userId, {
      sid,
      status: UserStatus.ONLINE,
    });
    this.webSocketKeyContainer.set(webSocketKey, { userId });
  }

  deleteConnection(webSocketKey: string): void {
    const userId = this.webSocketKeyContainer.get(webSocketKey)?.userId;
    if (!userId) return;
    const statusObject = this.statusContainer.get(userId);

    this.databaseService.executeQuery(
      `DELETE FROM ${env.database.schema}.user_session WHERE sid = '${statusObject.sid}';`,
    );
    this.webSocketKeyContainer.delete(webSocketKey);
    this.statusContainer.delete(userId);
    this.pubSub.publish(`status_of_${userId}`, {
      statusChange: UserStatus.OFFLINE,
    });
  }
}
