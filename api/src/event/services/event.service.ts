import { Injectable } from '@nestjs/common';
import {In, Repository} from 'typeorm';
import {forkJoin, from, Observable, of, switchMap, tap} from 'rxjs';
import { BaseService } from 'src/common/services/base.service';
import { EventEntity } from '../entity/event.entity';
import { TeamEntity } from 'src/team/entity/team.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { MessageService } from 'src/common/services/message/message.service';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateEventDto} from 'src/event/entity/dto/create-event.dto';

@Injectable()
export class EventService extends BaseService<EventEntity> {
  constructor(
    @InjectRepository(EventEntity)
    protected readonly repository: Repository<EventEntity>,
    public messageService: MessageService,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(repository, messageService, 'Event');
  }

  public createFromDto(dto: CreateEventDto): Observable<EventEntity> {
    return forkJoin({
      teams: dto.teamIds && dto.teamIds.length > 0
        ? this.teamRepository.find({ where: { id: In(dto.teamIds) } })
        : of([]),

      presentMembers: dto.presentMembersIds && dto.presentMembersIds.length > 0
        ? this.userRepository.find({ where: { id: In(dto.presentMembersIds) } })
        : of([]),
    }).pipe(
      tap(({ teams, presentMembers }) => {
        console.log('Teams found:', teams);
        console.log('Present Members found:', presentMembers);
      }),
      switchMap(({ teams, presentMembers }) => {
        const eventData: Partial<EventEntity> = {
          name: dto.name,
          startDate: dto.startDate,
          endDate: dto.endDate,
          teams,
          presentMembers,
        };
        return this.create(eventData);
      }),
    );
  }
}
