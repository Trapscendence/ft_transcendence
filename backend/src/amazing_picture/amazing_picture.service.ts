import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { FileUpload } from 'graphql-upload';
import { DatabaseService } from 'src/database/database.service';
import { env } from 'src/utils/envs';

@Injectable()
export class AmazingPictureService {
  constructor(private readonly databaseService: DatabaseService) {}

  async find() {
    return (
      await this.databaseService.executeQuery(
        `SELECT url FROM ${env.database.schema}.storage_url WHERE filename = "amazing_picture";`,
      )
    ).at(0)?.url;
  }

  async create(file: FileUpload) {
    const formData = new FormData();
    const fileData = await file.createReadStream().read();
    formData.append('amazing_picture', fileData, file.filename);
    const axiosResponse = await axios.post(
      `http://${env.storage.host}:${env.storage.port}/`,
      formData,
    );

    if (axiosResponse.status !== 200 && axiosResponse.status !== 201)
      throw new InternalServerErrorException(axiosResponse.statusText);

    await this.databaseService.executeQuery(
      `INSERT INTO ${env.database.schema}.storage_url(filename, url) VALUES("amazing_picture", "${axiosResponse.data}");`,
    );
    return true;
  }

  async delete() {
    const url = (
      await this.databaseService.executeQuery(
        `DELETE FROM ${env.database.schema}.storage_url WHERE filename = "amazing_picture" RETURNING "url";`,
      )
    ).at(0)?.url;
    await axios.delete(`http://${env.storage.host}:${env.storage.port}/${url}`);
    return true;
  }
}
