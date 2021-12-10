import { Module } from '@nestjs/common';
import { GamesModule } from 'src/games/games.module';
import { DatabaseModule } from 'src/database/database.module';
import { PubSubModule } from 'src/pubsub.module';
import { StatusService } from './status.service';

@Module({
  imports: [PubSubModule, GamesModule, DatabaseModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
