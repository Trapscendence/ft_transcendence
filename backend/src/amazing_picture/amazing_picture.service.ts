import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { DatabaseService } from 'src/database/database.service';
import { StorageService } from 'src/storage/storage.service';
import { env } from 'src/utils/envs';

@Injectable()
export class AmazingPictureService {
  constructor(
    private readonly storageService: StorageService,
    private readonly databaseService: DatabaseService,
  ) {}

  async find() {
    return (
      await this.databaseService.executeQuery(
        `SELECT url FROM ${env.database.schema}.storage_url WHERE filename = "amazing_picture";`,
      )
    ).at(0)?.url;
  }

  async create(file: FileUpload) {
    const amazingUrl = await this.storageService.post(file);
    if (!amazingUrl)
      throw new InternalServerErrorException(
        `Error occured during upload file, ${file.filename}`,
      );
    await this.databaseService.executeQuery(
      `INSERT INTO ${env.database.schema}.storage_url(filename, url) VALUES("amazing_picture", "${amazingUrl}");`,
    );
    return true;
  }

  async delete() {
    const filename = (
      await this.databaseService.executeQuery(
        `DELETE FROM ${env.database.schema}.storage_url WHERE filename = "amazing_picture" RETURNING "url";`,
      )
    ).at(0)?.url;
    await this.storageService.delete(filename);
    return true;
  }
}
