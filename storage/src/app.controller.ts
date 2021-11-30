import {
  Controller,
  Get,
  Post,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AppService } from './app.service';
import { SessionGuard } from './session.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/storage')
  @Get('/upload')
  getHello(): string {
    return this.appService.getHello();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload/profile')
  @UseGuards(SessionGuard)
  async uploadFile(
    @Session() session: { uid: string },
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (await this.appService.setUserProfileUrl(session.uid, file.filename))
      res.status(201).end();
    else res.status(500).end();
  }
}
