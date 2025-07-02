import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamEntity } from '../entity/team.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { MessageService } from 'src/common/services/message/message.service';
import {UserEntity} from 'src/user/entity/user.entity';
import {EventEntity} from 'src/event/entity/event.entity';
import {from, map, Observable, switchMap} from 'rxjs';
import {TeamListItemDto} from 'src/team/entity/dto/team-list-item.dto';
import {plainToInstance} from 'class-transformer';

@Injectable()
export class TeamService extends BaseService<TeamEntity> {
  constructor(
    @InjectRepository(TeamEntity)
    protected readonly teamRepository: Repository<TeamEntity>,
    protected readonly messageService: MessageService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {
    super(teamRepository, messageService, 'Team');
  }

  addMember(teamId: number, userId: number): Observable<TeamEntity> {
    return from(
      this.teamRepository.findOne({
        where: { id: teamId },
        relations: ['members'],
      }),
    ).pipe(
      switchMap((team) => {
        if (!team) {
          throw new NotFoundException(this.messageService.get('NOT_FOUND', 'Team'));
        }
        return from(this.userRepository.findOneBy({ id: userId })).pipe(
          switchMap((user) => {
            if (!user) {
              throw new NotFoundException(this.messageService.get('NOT_FOUND', 'User'));
            }
            team.members.push(user);
            return from(this.teamRepository.save(team));
          }),
        );
      }),
    );
  }

  removeMember(teamId: number, userId: number): Observable<TeamEntity> {
    return from(
      this.teamRepository.findOne({
        where: { id: teamId },
        relations: ['members'],
      }),
    ).pipe(
      switchMap((team) => {
        if (!team) throw new NotFoundException(this.messageService.get('NOT_FOUND', 'Team'));
        team.members = team.members.filter((m) => m.id !== userId);
        return from(this.teamRepository.save(team));
      }),
    );
  }

  findByClub(clubId: number): Observable<TeamListItemDto[]> {
    return from(
      this.teamRepository.find({
        where: { club: { id: clubId } },
        relations: ['club'],
        order: { name: 'ASC' },
      })
    ).pipe(
      map(teams => plainToInstance(TeamListItemDto, teams, { excludeExtraneousValues: true }))
    );
  }
}
