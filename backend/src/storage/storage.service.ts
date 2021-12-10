import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import * as FormData from 'form-data';
import { env } from 'src/utils/envs';
import { lastValueFrom, map } from 'rxjs';
import axios from 'axios';

@Injectable()
export class StorageService {
  private readonly logger = new Logger('Storage');

  constructor(private readonly httpService: HttpService) {}

  async post(file: FileUpload): Promise<string> {
    if (!file) throw new BadRequestException(`File is ${file}`);
    const formData = new FormData();
    formData.append('file', file.createReadStream(), file.filename);
    const storageUrl = await lastValueFrom(
      this.httpService
        .post(`http://${env.storage.host}:${env.storage.port}/`, formData, {
          headers: formData.getHeaders(),
        })
        .pipe(map((res) => res.data)),
    );
    if (!storageUrl) throw `Error occured during upload file, ${file.filename}`;
    this.logger.verbose(`Upload ${file.filename} on storage, ${storageUrl}`);
    return storageUrl;
  }

  async delete(filename: string): Promise<void> {
    await lastValueFrom(
      this.httpService
        .delete(`http://${env.storage.host}:${env.storage.port}/${filename}`)
        .pipe(map((res) => res.data)),
    );
    this.logger.verbose(`Delete ${filename} from storage`);
  }
}
