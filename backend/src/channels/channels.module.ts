import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsResolver } from './channels.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { PubSubModule } from 'src/pubsub.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PubSubModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [ChannelsService, ChannelsResolver],
})
export class ChannelsModule {}
