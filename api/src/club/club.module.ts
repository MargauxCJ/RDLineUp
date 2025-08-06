import { Module } from '@nestjs/common';
import { ClubService } from './services/club.service';
import { ClubController } from './controllers/club.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MessageModule} from '../common/services/message/message.module';
import {TeamEntity} from '../team/entity/team.entity';
import {ClubEntity} from './entity/club.entity';
import {EventEntity} from 'src/event/entity/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClubEntity,
      TeamEntity,
      EventEntity,
    ]),
    MessageModule,
  ],
  providers: [ClubService],
  controllers: [ClubController],
  exports: [ClubService],
})
export class ClubModule {}
