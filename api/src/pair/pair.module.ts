import { Module } from '@nestjs/common';
import { PairService } from './services/pair.service';
import { PairController } from './controllers/pair.controller';

@Module({
  providers: [PairService],
  controllers: [PairController]
})
export class PairModule {}
