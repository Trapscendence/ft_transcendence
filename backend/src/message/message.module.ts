import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { PubSubModule } from 'src/pubsub.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, PubSubModule, AuthModule],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
