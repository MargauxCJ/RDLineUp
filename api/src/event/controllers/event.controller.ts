import {Body, Controller, Post} from '@nestjs/common';
import {CreateClubDto} from 'src/club/entity/dto/create-club.dto';
import {Observable} from 'rxjs';
import {ClubEntity} from 'src/club/entity/club.entity';
import {ClubService} from 'src/club/services/club.service';
import {EventService} from 'src/event/services/event.service';
import {CreateEventDto} from 'src/event/entity/dto/create-event.dto';
import {EventEntity} from 'src/event/entity/event.entity';
import {DeepPartial} from 'typeorm';
import {BaseController} from 'src/common/controllers/base.controller';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Post()
  create(@Body() createEventDto: CreateEventDto): Observable<EventEntity> {
    return this.eventService.createFromDto(createEventDto);
  }
}
