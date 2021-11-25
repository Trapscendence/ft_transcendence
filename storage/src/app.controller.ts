import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/storage')
  getHello(): string {
    return this.appService.getHello();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/storage/${file.filename}`;
  }
}
