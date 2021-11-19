import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/pubsub.module';
import { StatusService } from './status.service';

@Module({ providers: [StatusService, PubSubModule], exports: [StatusService] })
export class StatusModule {}
