import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PubSubModule } from 'src/pubsub.module';
import { UsersModule } from 'src/users/users.module';
import { GamesResolver } from './games.resolver';
import { GamesService } from './games.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule), PubSubModule],
  providers: [GamesResolver, GamesService],
  exports: [GamesService],
})
export class GamesModule {}
