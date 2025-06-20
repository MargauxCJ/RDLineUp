import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from 'src/user/entity/user.entity';
import {TeamEntity} from 'src/team/entity/team.entity';
import {ClubEntity} from 'src/club/entity/club.entity';
import {EventEntity} from 'src/event/entity/event.entity';
import {AuthModule} from 'src/auth/auth.module';
import {MessageModule} from 'src/common/services/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TeamEntity,
      ClubEntity,
      EventEntity,
    ]),
    AuthModule,
    MessageModule,
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
