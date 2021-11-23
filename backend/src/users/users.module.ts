import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { GamesModule } from 'src/games/games.module';
import { StatusModule } from 'src/status/status.module';

@Module({
  // imports: [DatabaseModule, GamesModule],
  imports: [DatabaseModule, forwardRef(() => GamesModule), StatusModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
