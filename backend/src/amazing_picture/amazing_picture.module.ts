import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AmazingPictureResolver } from './amazing_picture.resolver';
import { AmazingPictureService } from './amazing_picture.service';

@Module({
  imports: [HttpModule, UsersModule],
  providers: [AmazingPictureResolver, AmazingPictureService],
})
export class AmazingPictureModule {}
