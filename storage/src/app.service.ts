import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { createReadStream, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('Storage');
  }

  find(filename: string) {
    const file = createReadStream(join(process.cwd(), 'public', filename));
    this.logger.log(`Read file: ${filename}`);
    return new StreamableFile(file);
  }

  create(file: Express.Multer.File) {
    this.logger.log(
      `Created file: ${file.originalname} > ${file.filename} (${file.size} bytes)`,
    );
    return file.filename;
  }

  delete(filename: string): boolean {
    try {
      unlinkSync(join(process.cwd(), 'public', filename));
      this.logger.log(`Delete file: ${filename}`);
      return true;
    } catch (error) {
      this.logger.error(`Error occured during delete file: ${filename}`);
      return false;
    }
  }
}
