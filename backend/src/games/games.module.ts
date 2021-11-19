import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PubSubModule } from 'src/pubsub.module';
import { UsersModule } from 'src/users/users.module';
import { GamesResolver } from './games.resolver';
import { GamesService } from './games.service';

@Module({
  imports: [DatabaseModule, UsersModule, PubSubModule],
  providers: [GamesResolver, GamesService],
})
export class GamesModule {}
