import { InternalServerErrorException } from '@nestjs/common';

export class MutedUsers {
  private channels: Map<string, Set<string>>;

  constructor() {
    this.channels = new Map<string, Set<string>>();
  }

  private updateChannel(channel_id, push: boolean) {
    if (!!this.channels.get(channel_id) === push) {
      // Already pushed or popped
      return false;
    } else {
      push
        ? this.channels.set(channel_id, new Set<string>())
        : this.channels.delete(channel_id);
      return true;
    }
  }

  pushChannel(channel_id: string): boolean {
    return this.updateChannel(channel_id, true);
  }

  popChannel(channel_id: string): boolean {
    return this.updateChannel(channel_id, false);
  }

  private updateUser(
    channel_id: string,
    user_id: string,
    push: boolean,
  ): boolean {
    const usersSet = this.channels.get(channel_id);

    if (usersSet === undefined) {
      console.error(`User pushed before channel(id: ${channel_id}) push`);
      throw new InternalServerErrorException(
        `No such channel(id: ${channel_id})`,
      );
    } else if (!!usersSet.has(user_id) === push) {
      // Already muted or unmuted
      return false;
    } else {
      push ? usersSet.add(user_id) : usersSet.delete(user_id);
      return true;
    }
  }

  pushUser(channel_id: string, user_id: string): boolean {
    return this.updateUser(channel_id, user_id, true);
  }

  popUser(channel_id: string, user_id: string): boolean {
    return this.updateUser(channel_id, user_id, false);
  }

  getUsers(channel_id: string): string[] {
    const usersSet = this.channels.get(channel_id);
    const usersSetDeepCopy: string[] = [];

    if (usersSet !== undefined) {
      for (const id of usersSet) {
        usersSetDeepCopy.push(id);
      }
    }
    return usersSetDeepCopy;
  }

  hasChannel(channel_id: string) {
    return !!this.channels.get(channel_id);
  }

  hasUser(channel_id: string, user_id: string): boolean {
    return !!this.channels.get(channel_id)?.has(user_id);
  }
}
