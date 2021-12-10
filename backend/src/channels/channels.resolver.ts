import { ConflictException, Inject, UseGuards } from '@nestjs/common';
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
import { User, UserRole } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from './channels.service';
import { Channel, ChannelNotify } from './models/channel.model';
import { PubSub } from 'graphql-subscriptions';
import { ChannelRoleGuard } from './guard/channel-role.guard';
import { UserID } from 'src/users/decorators/user-id.decorator';
import { ChannelRoles } from './decorators/channel-roles.decorator';

@Resolver((of) => Channel)
@UseGuards(ChannelRoleGuard)
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

  @Query((returns) => [Channel], { name: 'channels', nullable: true })
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
    @UserID() user_id: string,
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('password', { nullable: true }) password: string,
  ): Promise<Channel | null> {
    return await this.channelsService.enterChannel(
      user_id,
      channel_id,
      password,
    );
  }

  @Mutation((returns) => Boolean)
  async leaveChannel(@UserID() user_id: string): Promise<Boolean> {
    return await this.channelsService.leaveChannel(user_id);
  }

  @Mutation((returns) => Channel, { nullable: true })
  async addChannel(
    @UserID() user_id: string,
    @Args('title') title: string,
    @Args('password', { nullable: true }) password: string,
  ) {
    const channelId = await this.usersService.getChannelIdByUserId(user_id);
    if (channelId) {
      throw new ConflictException(
        `The user(id: ${user_id}) is in another channel(id: ${channelId})`,
      );
    }
    const newChannelId = await this.channelsService.addChannel(title, password);
    await this.channelsService.enterChannel(user_id, newChannelId, password);
    await this.channelsService.updateChannelRole(user_id, UserRole.OWNER);
  }

  @Mutation((returns) => Boolean)
  async chatMessage(
    @UserID() user_id: string,
    @Args('message') message: string,
  ) {
    return await this.channelsService.chatMessage(user_id, message);
  }

  @ChannelRoles(UserRole.ADMIN)
  @Mutation((returns) => Boolean)
  async muteUserOnChannel(
    @UserID() my_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
    @Args('mute_time', { type: () => Int! }) mute_time: number,
  ): Promise<boolean> {
    // Mute myself?
    if (my_id === user_id) {
      throw new ConflictException(
        `Cannot self mute(user: ${my_id}, target: ${user_id})`,
      );
    }

    // Mute admin?
    const user_role: UserRole = await this.usersService.getChannelRole(user_id);
    if (user_role !== UserRole.USER) {
      throw new ConflictException(
        `Cannot mute administrator(id: ${user_id}, role: ${user_role})`,
      );
    }

    const channel_id = await this.usersService.getChannelIdByUserId(my_id);
    if (channel_id === null) {
      throw new ConflictException(
        `The user(id: ${my_id}) is not on any channel`,
      );
    }
    await this.channelsService.updateChannelMute(
      channel_id,
      user_id,
      mute_time,
    );
    return true;
  }

  @ChannelRoles(UserRole.ADMIN)
  @Mutation((returns) => Boolean)
  async unmuteUserOnChannel(
    @UserID() my_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ): Promise<boolean> {
    const channel_id = await this.usersService.getChannelIdByUserId(my_id);
    if (channel_id === null) {
      throw new ConflictException(
        `The user(id: ${my_id}) is not on any channel`,
      );
    }
    await this.channelsService.updateChannelMute(channel_id, user_id, 0);
    return true;
  }

  @ChannelRoles(UserRole.ADMIN)
  @Mutation((returns) => Boolean)
  async kickUserFromChannel(
    @UserID() my_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ): Promise<boolean> {
    // Kick self?
    if (my_id === user_id) {
      throw new ConflictException(
        `Cannot self kick(user: ${my_id}, target: ${user_id})`,
      );
    }

    // Kick admin?
    const user_role: UserRole = await this.usersService.getChannelRole(user_id);
    if (user_role !== UserRole.USER) {
      throw new ConflictException(
        `Cannot kick administrator(id: ${user_id}, role: ${user_role})`,
      );
    }

    const channel_id = await this.usersService.getChannelIdByUserId(my_id);
    return await this.channelsService.kickUser(channel_id, user_id);
  }

  @ChannelRoles(UserRole.ADMIN)
  @Mutation((returns) => Boolean)
  async banUserFromChannel(
    @UserID() my_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ) {
    // Ban self?
    if (my_id === user_id) {
      throw new ConflictException(
        `Cannot self ban(user: ${my_id}, target: ${user_id})`,
      );
    }

    // Ban admin?
    const user_role: UserRole = await this.usersService.getChannelRole(user_id);
    if (user_role !== UserRole.USER) {
      throw new ConflictException(
        `Cannot ban administrator(id: ${user_id}, role: ${user_role})`,
      );
    }

    const channel_id = await this.usersService.getChannelIdByUserId(my_id);
    return await this.channelsService.updateChannelBan(
      channel_id,
      user_id,
      true,
    );
  }

  @ChannelRoles(UserRole.ADMIN)
  @Mutation((returns) => Boolean)
  async unbanUserFromChannel(
    @UserID() my_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ): Promise<boolean> {
    const channel_id = await this.usersService.getChannelIdByUserId(my_id);
    return await this.channelsService.updateChannelBan(
      channel_id,
      user_id,
      false,
    );
  }

  @ChannelRoles(UserRole.OWNER)
  @Mutation((returns) => Channel, { nullable: true })
  async editChannel(
    @UserID() my_id: string,
    @Args('title') title: string,
    @Args('password', { nullable: true }) password: string,
  ): Promise<Channel> {
    const channel_id = await this.usersService.getChannelIdByUserId(my_id);
    return await this.channelsService.editChannel(channel_id, title, password);
  }

  @ChannelRoles(UserRole.OWNER)
  @Mutation((returns) => Boolean)
  async delegateUserOnChannel(
    @UserID() my_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ): Promise<boolean> {
    if (my_id === user_id) {
      throw new ConflictException(
        `Cannot self delegate (me: ${my_id}, target: ${user_id})`,
      );
    }

    const myChannelId: string = (
      await this.usersService.getChannelByUserId(my_id)
    )?.id;
    const usersChannelId: string = (
      await this.usersService.getChannelByUserId(user_id)
    )?.id;

    if (myChannelId !== usersChannelId) {
      throw new ConflictException(
        `The user(id: ${user_id}) is not on your channel(id: ${myChannelId})`,
      );
    }

    return await this.channelsService.updateChannelRole(
      user_id,
      UserRole.ADMIN,
    );
  }

  @ChannelRoles(UserRole.OWNER)
  @Mutation((returns) => Boolean)
  async relegateUserOnChannel(
    @UserID() my_id: string,
    @Args('user_id', { type: () => ID! }) user_id: string,
  ) {
    if (my_id === user_id) {
      throw new ConflictException(
        `Cannot self relegate (me: ${my_id}, target: ${user_id})`,
      );
    }

    const myChannelId: string = (
      await this.usersService.getChannelByUserId(my_id)
    )?.id;
    const usersChannelId: string = (
      await this.usersService.getChannelByUserId(user_id)
    )?.id;

    if (myChannelId !== usersChannelId) {
      throw new ConflictException(
        `The user(id: ${user_id}) is not on your channel(id: ${myChannelId})`,
      );
    }

    return await this.channelsService.updateChannelRole(user_id, UserRole.USER);
  }

  @ChannelRoles(UserRole.OWNER) // TODO: to be site role
  @Mutation((returns) => Boolean)
  async deleteChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
  ) {
    return await this.channelsService.deleteChannel(channel_id);
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

  @ResolveField('banned_users', (returns) => [User])
  async banned_users(@Parent() channel: Channel): Promise<User[]> {
    return await this.channelsService.getBannedUsers(channel.id);
  }

  @ResolveField('muted_users', (returns) => [User])
  async muted_users(@Parent() channel: Channel): Promise<User[]> {
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
  subscribeChannelList() {
    return this.pubSub.asyncIterator('new_channel');
  }
}
