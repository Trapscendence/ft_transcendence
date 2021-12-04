import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { GamesModule } from 'src/games/games.module';
import { HttpModule } from '@nestjs/axios';
import { StatusModule } from 'src/status/status.module';
import { AchievementsModule } from 'src/acheivements/acheivements.module';

@Module({
  imports: [
    DatabaseModule,
    StatusModule,
    forwardRef(() => GamesModule),
    HttpModule,
    AchievementsModule,
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
