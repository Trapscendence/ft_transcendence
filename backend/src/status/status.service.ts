import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub.module';
import { UserStatus } from 'src/users/models/user.model';

@Injectable()
export class StatusService {
  container: Map<string, [UserStatus, Set<string>]>;

  constructor(@Inject(PUB_SUB) private readonly pubSub: PubSub) {
    this.container = new Map<string, [UserStatus, Set<string>]>();
  }

  setStatus(user_id: string, status: UserStatus): boolean {
    if (status === UserStatus.OFFLINE) return false;
    this.pubSub.publish(`status_of_${user_id}`, { statusChange: status });
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

  newConnection(user_id: string, token: string): void {
    if (!this.container.has(user_id)) {
      this.pubSub.publish(`status_of_${user_id}`, {
        statusChange: UserStatus.ONLINE,
      });
      this.container.set(user_id, [UserStatus.ONLINE, new Set<string>()]);
    }
    const wsSet = this.container.get(user_id)[1];
    wsSet.add(token);
  }

  deleteConnection(user_id: string, token: string): void {
    console.log('delete', user_id);
    const wsSet = this.container.get(user_id)?.[1];
    if (!wsSet) return;
    wsSet.delete(token);
    if (!wsSet.size) {
      this.container.delete(user_id);
      this.pubSub.publish(`status_of_${user_id}`, {
        statusChange: UserStatus.OFFLINE,
      });
    }
  }
}
