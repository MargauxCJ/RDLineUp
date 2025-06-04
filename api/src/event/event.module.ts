import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';

@Module({
  providers: [EventService],
  controllers: [EventController]
})
export class EventModule {}
