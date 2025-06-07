import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TeamEntity} from 'src/team/entity/team.entity';
import {ClubEntity} from 'src/club/entity/club.entity';
import {UserEntity} from 'src/user/entity/user.entity';
import {EventEntity} from 'src/event/entity/event.entity';
import {MessageModule} from 'src/common/services/message/message.module';
import {AuthModule} from 'src/auth/auth.module';

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
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
