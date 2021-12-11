import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FTStrategy } from './strategies/ft.strategy';
import { AuthResolver } from './auth.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { StatusModule } from 'src/status/status.module';
import { GamesService } from 'src/games/games.service';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    PassportModule,
    StatusModule,
    GamesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FTStrategy, AuthResolver],
})
export class AuthModule {}
