import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/pubsub.module';
import { StatusService } from './status.service';

@Module({
  imports: [PubSubModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
