import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import {Observable} from 'rxjs';
import {EventService} from 'src/event/services/event.service';
import {CreateEventDto} from 'src/event/entity/dto/create-event.dto';
import {EventEntity} from 'src/event/entity/event.entity';
import {JwtAuthGuard} from 'src/auth/guards/jwt-guard';
import {PaginationQueryDto} from 'src/common/entities/paginationQuery.dto';
import {PaginatedResultDto} from 'src/common/entities/paginatedResult.dto';
import {EventsListDto} from 'src/event/entity/dto/events-list.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto): Observable<EventEntity> {
    return this.eventService.createFromDto(createEventDto);
  }

  @Get('paginated')
  findAllPaginated(
    @Query() paginationQuery: PaginationQueryDto,
  ): Observable<PaginatedResultDto<EventsListDto>> {
    return this.eventService.findAllPaginatedWithFilters(
      paginationQuery.page,
      paginationQuery.limit,
      ['teams'],
      paginationQuery.search,
      paginationQuery.teamId,
    );
  }
}
