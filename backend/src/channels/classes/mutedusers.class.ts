export class MutedUsers {
  private channels: Map<string, Set<string>>;

  constructor() {
    this.channels = new Map<string, Set<string>>();
  }

  pushUser(channel_id: string, user_id: string): void {
    const channel = this.channels.get(channel_id);
    if (!channel) {
      this.channels.set(channel_id, new Set<string>());
      const channel = this.channels.get(channel_id);
    }
    channel.add(user_id);
  }

  popUser(channel_id: string, user_id: string): boolean {
    const channel = this.channels.get(channel_id);
    if (!channel) return false;
    if (!channel.has(user_id)) return false;
    channel.delete(user_id);
    return true;
  }

  getUserIds(channel_id: string): string[] {
    const channel = this.channels.get(channel_id);
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
}
