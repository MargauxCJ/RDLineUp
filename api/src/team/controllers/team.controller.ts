import {Body, Controller, Get, Param, Post, Put, Delete, BadRequestException} from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { Observable } from 'rxjs';
import { TeamEntity } from '../entity/team.entity';
import { map } from 'rxjs/operators';
import {CreateTeamDto} from 'src/team/entity/dto/create-team.dto';
import {TeamListItemDto} from 'src/team/entity/dto/team-list-item.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto): Observable<TeamEntity> {
    const teamToCreate = {
      ...createTeamDto,
      club: { id: createTeamDto.clubId },
    } as any;

    return this.teamService.create(teamToCreate);
  }

  @Get()
  findAll(): Observable<TeamEntity[]> {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<TeamEntity> {
    return this.teamService.findOneByField('id', id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateTeamDto>,
  ): Observable<any> {
    return this.teamService.updateOneByField('id', id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return this.teamService.deleteOneByField('id', id);
  }

  @Post(':teamId/members/:userId')
  addMember(
    @Param('teamId') teamId: number,
    @Param('userId') userId: number,
  ): Observable<TeamEntity> {
    return this.teamService.addMember(teamId, userId);
  }

  @Delete(':teamId/members/:userId')
  removeMember(
    @Param('teamId') teamId: number,
    @Param('userId') userId: number,
  ): Observable<TeamEntity> {
    return this.teamService.removeMember(teamId, userId);
  }

  @Get(':clubId/teams')
  getTeamsByClub(@Param('clubId') clubId: string) {
    const numericClubId = Number(clubId);
    if (isNaN(numericClubId)) {
      throw new BadRequestException('Invalid club ID');
    }
    return this.teamService.findByClub(numericClubId);
  }

}
