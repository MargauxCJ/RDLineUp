import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from 'src/common/services/message/message.service';
import {BaseService} from '../../common/services/base.service';
import {ClubEntity} from '../entity/club.entity';

@Injectable()
export class ClubService extends BaseService<ClubEntity> {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
    protected readonly messageService: MessageService,
  ) {
    super(clubRepository, messageService, 'Club');
  }
}
