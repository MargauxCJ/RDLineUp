import {AbstractEntity, EntityInterface} from '../entity';
import {Team} from '../teams/team.model';
import {User} from '../users/user.model';
import {Club} from '../clubs/club.model';

export interface GameInterface extends EntityInterface {
  schedule: Date;
  team: Team;
  opponentTeam: string;
  event: Event;
  players: User[];
  // pairs: Pair[];
  club: Club;
}

export class Game extends AbstractEntity implements GameInterface {
  public schedule: Date = null;
  public team: Team = null;
  public opponentTeam: string = null;
  public event: Event = null;
  public players: User[] = null;
  // public pairs: Pair[] = null;
  public club: Club = null;

  public static override getEntityName(): 'game' {
    return 'game';
  }
}
