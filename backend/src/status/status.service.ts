import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub.module';
import { UserStatus } from 'src/users/models/user.model';
import { StatusContainer } from './classes/statuscontainer.class';

@Injectable()
export class StatusService {
  constructor(
    private readonly statusContainer: StatusContainer,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  setStatus(user_id: string, status: UserStatus): boolean {
    this.pubSub.publish(`status_of_${user_id}`, status);
    return this.statusContainer.setStatus(user_id, status);
  }

  getStatus(user_id: string): UserStatus {
    return this.statusContainer.getStatus(user_id);
  }

  newConnection(user_id: string, ws: WebSocket): void {
    this.statusContainer.newConnection(user_id, ws);
    this.pubSub.publish(`status_of_${user_id}`, this.getStatus(user_id));
  }

  deleteConnection(ws: WebSocket): void {
    if (this.statusContainer.deleteConnection(ws))
      this.pubSub.publish(
        `status_of_${this.statusContainer.getUserId(ws)}`,
        UserStatus.OFFLINE,
      );
  }
}
