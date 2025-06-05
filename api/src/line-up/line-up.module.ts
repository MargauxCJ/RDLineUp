import { Module } from '@nestjs/common';
import { LineUpService } from './services/line-up.service';
import { LineUpController } from './controllers/line-up.controller';

@Module({
  providers: [LineUpService],
  controllers: [LineUpController]
})
export class LineUpModule {}
