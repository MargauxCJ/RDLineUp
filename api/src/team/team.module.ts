import { Module } from '@nestjs/common';
import { TeamService } from './services/team.service';
import { TeamController } from './controllers/team.controller';
import {TeamEntity} from 'src/team/entity/team.entity';
import {MessageModule} from 'src/common/services/message/message.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ClubEntity} from 'src/club/entity/club.entity';
import {UserEntity} from 'src/user/entity/user.entity';
import {EventEntity} from 'src/event/entity/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeamEntity,
      ClubEntity,
      UserEntity,
      EventEntity,
    ]),
    MessageModule,
  ],
  providers: [TeamService],
  controllers: [TeamController],
  exports: [TeamService],
})
export class TeamModule {}
