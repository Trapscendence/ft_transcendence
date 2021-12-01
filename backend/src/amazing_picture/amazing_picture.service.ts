import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { DatabaseService } from 'src/database/database.service';
import { env } from 'src/utils/envs';

@Injectable()
export class AmazingPictureService {
  constructor(private readonly httpService: HttpService) {}

  uploadAmazingPicture(amazing_picture: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpService
        .post(
          `http://${env.storage.host}:${env.storage.port}/upload/amazing_picture`,
          amazing_picture,
        )
        .subscribe({
          next: async (axiosResponse: AxiosResponse) => {
            if (axiosResponse.status === 201) resolve(true);
            else resolve(false);
          },
          error(error) {
            reject(error);
          },
          complete() {},
        });
    });
  }

  deleteAmazingPicture(): void {
    this.httpService.delete(
      `http://${env.storage.host}:${env.storage.port}/delete/amazing_picture`,
    );
  }
}
