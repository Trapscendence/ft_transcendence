import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { createReadStream, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  private readonly findLogger: Logger;
  private readonly createLogger: Logger;
  private readonly deleteLogger: Logger;

  constructor() {
    this.findLogger = new Logger('GET');
    this.createLogger = new Logger('POST');
    this.deleteLogger = new Logger('DELETE');
  }

  find(filename: string) {
    const file = createReadStream(join(process.cwd(), 'public', filename));
    this.findLogger.log(`Search the file: ${filename}`);
    return new StreamableFile(file);
  }

  create(file: Express.Multer.File) {
    this.createLogger.log(
      `Created file: ${file.originalname} -> ${file.filename} (${file.size} bytes)`,
    );
    return file.filename;
  }

  delete(filename: string): boolean {
    try {
      unlinkSync(join(process.cwd(), 'public', filename));
      this.deleteLogger.log(`Delete the file: ${filename}`);
      return true;
    } catch (error) {
      this.deleteLogger.error(`Error occured during delete file: ${filename}`);
      return false;
    }
  }
}
