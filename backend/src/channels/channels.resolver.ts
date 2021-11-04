import { Inject } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PUB_SUB } from 'src/pubsub.module';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from './channels.service';
import { Channel, ChannelNotify } from './models/channel.model';
import { PubSub } from 'graphql-subscriptions';

@Resolver((of) => Channel)
export class ChannelsResolver {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  /*
   ** ANCHOR: Channel Query
   */

  @Query((returns) => Channel, { name: 'channel', nullable: true })
  async getChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
  ) {
    return await this.channelsService.getChannel(channel_id);
  }

  @Query((returns) => [Channel], { name: 'channels', nullable: true }) // TODO: 제대로 하려면 수정 필요할 듯? 필터링 부분...
  async getChannels(
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number, // 0일 경우 모두 불러옴
  ) {
    return await this.channelsService.getChannels(offset, limit);
  }

  /*
   ** ANCHOR: Channel Mutation
   */

  @Mutation((returns) => Channel, { nullable: true })
  async enterChannel(
    @Args('user_id', { type: () => ID! }) user_id: string,
    @Args('channel_id', { type: () => ID! }) channel_id: string,
  ): Promise<Channel | null> {
    return await this.channelsService.enterChannel(user_id, channel_id);
  }

  @Mutation((returns) => Boolean)
  async leaveChannel(
    @Args('user_id', { type: () => ID! }) user_id: string,
    @Args('channel_id', { type: () => ID! }) channel_id: string,
  ): Promise<Boolean> {
    return await this.channelsService.leaveChannel(user_id, channel_id);
  }

  @Mutation((returns) => Channel, { nullable: true })
  async addChannel(
    @Args('title') title: string,
    @Args('password', { nullable: true }) password: string,
    @Args('owner_user_id') owner_user_id: string,
  ) {
    return await this.channelsService.addChannel(
      title,
      password,
      owner_user_id,
    );
  }

  @Mutation((returns) => Channel, { nullable: true })
  async editChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('title') title: string,
    @Args('password', { nullable: true }) password: string,
  ): Promise<Channel> {
    return await this.channelsService.editChannel(channel_id, title, password);
  }

  @Mutation((returns) => Boolean)
  async deleteChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
  ) {
    return await this.channelsService.deleteChannel(channel_id);
  }

  @Mutation((returns) => Boolean) // TODO: User 여기서 어떻게 쓰는지 알아보기
  muteUserOnChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('mute_time', { type: () => Int! }) mute_time: number,
  ): boolean {
    return this.channelsService.muteUserOnChannel(
      channel_id,
      user_id,
      mute_time,
    );
  }

  @Mutation((returns) => Boolean)
  unmuteUserOnChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ): boolean {
    return this.channelsService.unmuteUserFromChannel(channel_id, user_id);
  }

  @Mutation((returns) => Boolean)
  async kickUserFromChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ): Promise<boolean> {
    return await this.channelsService.kickUserFromChannel(channel_id, user_id);
  }

  @Mutation((returns) => Boolean)
  async banUserFromChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ) {
    return await this.channelsService.banUserFromChannel(channel_id, user_id);
  }

  @Mutation((returns) => Boolean)
  async unbanUserFromChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ): Promise<boolean> {
    return await this.channelsService.unbanUserFromChannel(channel_id, user_id);
  }

  @Mutation((returns) => Boolean) // TODO: 아마... chat 유형이 필요하지 않을까?
  async chatMessage(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
    @Args('message') message: string,
  ) {
    return await this.channelsService.chatMessage(channel_id, user_id, message);
  }

  /*
   ** ANCHOR: Channel ResolveField
   */

  @ResolveField('owner', (returns) => User)
  async owner(@Parent() channel: Channel): Promise<User> {
    return await this.channelsService.getOwner(channel.id);
  }

  @ResolveField('administrators', (returns) => [User])
  async administrators(@Parent() channel: Channel): Promise<User[]> {
    return await this.channelsService.getAdministrators(channel.id);
  }

  @ResolveField('participants', (returns) => [User])
  async participants(@Parent() channel: Channel): Promise<User[]> {
    return await this.channelsService.getParticipants(channel.id);
  }

  @ResolveField('bannedUsers', (returns) => [User])
  async bannedUsers(@Parent() channel: Channel): Promise<User[]> {
    return await this.channelsService.getBannedUsers(channel.id);
  }

  @ResolveField('mutedUsers', (returns) => [User])
  async mutedUsers(@Parent() channel: Channel): Promise<User[]> {
    return await this.channelsService.getMutedUsers(channel.id);
  }

  /*
   ** ANCHOR: Channel Subscription
   */

  @Subscription((returns) => ChannelNotify)
  subscribeChannel(@Args('channel_id') channel_id: string) {
    return this.pubSub.asyncIterator(`to_channel_${channel_id}`);
  }

  @Subscription((returns) => Channel)
  subscribeChannelUpdate() {
    return this.pubSub.asyncIterator('new_channel');
  }
}
