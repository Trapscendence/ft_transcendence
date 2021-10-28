import { Injectable } from '@nestjs/common';
import { Channel } from './models/channel.medel';

@Injectable()
export class ChannelsService {
  private readonly channels: Channel[] = [];

  findOneById(id: string) {}

  findAll(isPrivate: boolean) {}
  
}
