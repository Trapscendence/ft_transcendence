import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/storage/storage.module';
import { UsersModule } from 'src/users/users.module';
import { AmazingPictureResolver } from './amazing_picture.resolver';
import { AmazingPictureService } from './amazing_picture.service';

@Module({
  imports: [StorageModule, DatabaseModule, UsersModule],
  providers: [AmazingPictureResolver, AmazingPictureService],
})
export class AmazingPictureModule {}
