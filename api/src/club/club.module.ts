import { Module } from '@nestjs/common';
import { ClubService } from './services/club.service';
import { ClubController } from './controllers/club.controller';

@Module({
  providers: [ClubService],
  controllers: [ClubController]
})
export class ClubModule {}
