import {AbstractEntity, EntityInterface} from '../entity';
import {Team} from '../teams/team.model';
import {User} from '../users/user.model';
import {Game} from '../games/game.model';
import {Club} from '../clubs/club.model';

export interface EventInterface extends EntityInterface {
  name: string;
  startDate: Date;
  endDate?: Date;
  teams: Team[];
  presentMembers: User[];
  games: Game[];
  club: Club;
}

export class Event extends AbstractEntity implements EventInterface {
  public name: string = null;
  public startDate: Date = null;
  public endDate?: Date = null;
  public teams: Team[] = null;
  public presentMembers: User[] = null;
  public games: Game[] = null;
  public club: Club = null;

  public static override getEntityName(): 'event' {
    return 'event';
  }
}
