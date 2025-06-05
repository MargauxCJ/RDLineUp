import { Module } from '@nestjs/common';
import { JamService } from './services/jam.service';
import { JamController } from './controllers/jam.controller';

@Module({
  providers: [JamService],
  controllers: [JamController]
})
export class JamModule {}
