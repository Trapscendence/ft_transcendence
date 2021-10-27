import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { DM } from './model/message.model';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDMs(user_id: string, other_id: string): Promise<DM> {
    return await this.databaseService.executeQuery(`
SELECT
  sender_id,
  check_date
FROM
  dm
WHERE
  sender_id = ${user_id} AND receiver_id = ${other_id};
    `)[0]
  }
}
