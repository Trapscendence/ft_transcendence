import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MessageService {
  constructor(private readonly databaseServise: DatabaseService) {}

  async getDm(id: string): Promise<any> {
    return new Promise(() => {});
  }
}
