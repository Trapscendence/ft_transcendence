import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger('App');

  constructor(private readonly appService: AppService) {}

  @Get('/storage/:filename')
  findFile(@Param('filename') filename: string) {
    return this.appService.find(filename);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) this.logger.error(`Uploaded file is ${file}`);
    else return this.appService.create(file);
  }

  @Delete('/:filename')
  deleteFile(@Param('filename') filename: string) {
    return this.appService.delete(filename);
  }
}
