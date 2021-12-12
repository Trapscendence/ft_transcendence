import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsResolver } from './channels.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { PubSubModule } from 'src/pubsub.module';

@Module({
  imports: [DatabaseModule, UsersModule, PubSubModule],
  providers: [ChannelsService, ChannelsResolver],
})
export class ChannelsModule {}
