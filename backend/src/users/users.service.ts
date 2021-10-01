import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  getAllUsers(): Promise<any> {
    return this.databaseService.executeQuery('SELECT * FROM testa');
  }
}
