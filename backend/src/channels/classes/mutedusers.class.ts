import { channel } from 'diagnostics_channel';

export class MutedUsers {
  private channels: Map<string, Set<string>>;

  constructor() {
    this.channels = new Map<string, Set<string>>();
  }

  pushUser(channel_id: string, user_id: string): void {
    // const channel = this.channels.get(channel_id);
    // if (!channel) {
    //   this.channels.set(channel_id, new Set<string>());
    //   const channel = this.channels.get(channel_id);
    // }
    // channel.add(user_id);

    // NOTE -gmoon
    // channel이 없을 때 발생하던 에러 수정하였습니다.
    // 스코프 안에서 const 선언해도 밖에서는 사용할 수 없어 에러가 발생합니다.
    // 다음과 같이 두 가지 방법으로 고칠 수 있을 것 같습니다.

    // let channel = this.channels.get(channel_id);
    // if (!channel) {
    //   this.channels.set(channel_id, new Set<string>());
    //   channel = this.channels.get(channel_id);
    // }
    // channel.add(user_id);

    if (!this.channels.get(channel_id))
      this.channels.set(channel_id, new Set<string>());
    this.channels.get(channel_id).add(user_id);

    // NOTE: 현재 유저가 그 채널에 없어도 그냥 push되는 문제가 있습니다. -gmoon
  }

  popUser(channel_id: string, user_id: string): boolean {
    const channel = this.channels.get(channel_id);
    if (!channel) return false;
    if (!channel.has(user_id)) return false;
    channel.delete(user_id);
    return true;
  }

  getUserIds(channel_id: string): string[] {
    const channel = this.channels.get(channel_id.toString()); // NOTE: 이상하게 number로 들어와서 toString() 하지 않으면 무조건 undefined가 됩니다. -gmoon
    if (!channel) return [];
    const user_ids: string[] = [];
    for (const id of channel) {
      user_ids.push(id);
    }
    return user_ids;
  }

  popChannel(channel_id: string): boolean {
    const channel = this.channels.get(channel_id);
    if (!channel) return false;
    this.channels.delete(channel_id);
    return true;
  }

  hasUser(channel_id: string, user_id: string): boolean {
    if (this.channels.get(channel_id)?.has(user_id)) return true;
    return false;
  }
}
