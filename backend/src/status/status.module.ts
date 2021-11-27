import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PubSubModule } from 'src/pubsub.module';
import { StatusService } from './status.service';

@Module({
  imports: [PubSubModule, DatabaseModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
