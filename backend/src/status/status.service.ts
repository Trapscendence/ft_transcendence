import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub.module';
import { UserStatus } from 'src/users/models/user.model';

@Injectable()
export class StatusService {
  container: Map<string, [UserStatus, Set<WebSocket>]>;
  wsOwner: Map<WebSocket, string>;

  constructor(@Inject(PUB_SUB) private readonly pubSub: PubSub) {
    this.container = new Map<string, [UserStatus, Set<WebSocket>]>();
    this.wsOwner = new Map<WebSocket, string>();
  }

  setStatus(user_id: string, status: UserStatus): boolean {
    this.pubSub.publish(`status_of_${user_id}`, status);
    if (status === UserStatus.OFFLINE) return false;
    const beforeSet = this.container.get(user_id);
    if (!beforeSet) return false;
    beforeSet[0] = status;
    return true;
  }

  getStatus(user_id: string): UserStatus {
    const status = this.container.get(user_id)?.[0];
    if (!status) return UserStatus.OFFLINE;
    return status;
  }

  newConnection(user_id: string, ws: WebSocket): void {
    if (!this.container.has(user_id))
      this.pubSub.publish(`status_of_${user_id}`, UserStatus.ONLINE);
    this.wsOwner.set(ws, user_id);
    if (!this.container.has(user_id))
      this.container.set(user_id, [UserStatus.ONLINE, new Set<WebSocket>()]);
    const wsSet = this.container.get(user_id)[1];
    wsSet.add(ws);
  }

  deleteConnection(ws: WebSocket): void {
    const user_id = this.wsOwner.get(ws);
    this.wsOwner.delete(ws);
    const wsSet = this.container.get(user_id)?.[1];
    if (!wsSet) return;
    wsSet.delete(ws);
    if (!wsSet.size) {
      this.container.delete(user_id);
      this.pubSub.publish(
        `status_of_${this.getUserId(ws)}`,
        UserStatus.OFFLINE,
      );
    }
  }
  getUserId(ws: WebSocket): string {
    return this.wsOwner.get(ws);
  }
}
