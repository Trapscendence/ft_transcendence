import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ReadStream } from 'fs';
import { FileUpload } from 'graphql-upload';
import { DatabaseService } from 'src/database/database.service';
import { StorageService } from 'src/storage/storage.service';
import { env } from 'src/utils/envs';

@Injectable()
export class AmazingPictureService {
  private readonly logger = new Logger(AmazingPictureService.name);

  constructor(
    private readonly storageService: StorageService,
    private readonly databaseService: DatabaseService,
  ) {}

  async find() {
    return (
      await this.databaseService.executeQuery(
        `SELECT url FROM ${env.database.schema}.storage_url WHERE filename = 'amazing_picture';`,
      )
    ).at(0)?.url;
  }

  async create(filestream: ReadStream, filename: string) {
    const defaultAmazingPicture = await this.find();
    if (defaultAmazingPicture) {
      this.logger.verbose(`Skip creating default amazing picture`);
      return false;
    }
    const amazingUrl = await this.storageService.post(filestream, filename);
    if (!amazingUrl)
      throw new InternalServerErrorException(
        `Error occured during upload file, ${filename}`,
      );
    await this.databaseService.executeQuery(
      `INSERT INTO ${env.database.schema}.storage_url(filename, url) VALUES('amazing_picture', '${amazingUrl}');`,
    );
    return true;
  }

  async delete() {
    const filename = (
      await this.databaseService.executeQuery(
        `DELETE FROM ${env.database.schema}.storage_url WHERE filename = 'amazing_picture' RETURNING "url";`,
      )
    ).at(0)?.url;
    if (filename)
      await this.storageService.delete(filename);
    return true;
  }
}
