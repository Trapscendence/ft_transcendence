import { Module } from '@nestjs/common';
import { GamesModule } from 'src/games/games.module';
import { GamesService } from 'src/games/games.service';
import { PubSubModule } from 'src/pubsub.module';
import { StatusService } from './status.service';

@Module({
  imports: [PubSubModule, GamesModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
