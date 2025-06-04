import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {typeOrmConfig} from './config/typeorm.config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import { ClubModule } from './club/club.module';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { EventModule } from './event/event.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ClubModule,
    UserModule,
    TeamModule,
    EventModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
