import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { StatusModule } from 'src/status/status.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, StatusModule, HttpModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
