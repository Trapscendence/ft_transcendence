import { Module } from '@nestjs/common';
import { MatchsResolver } from './matchs.resolver';
import { MatchsService } from './matchs.service';

@Module({
  providers: [MatchsResolver, MatchsService]
})
export class MatchsModule {}
