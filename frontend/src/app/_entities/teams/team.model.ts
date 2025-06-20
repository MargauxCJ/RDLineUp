import {AbstractEntity, EntityInterface} from '../entity';
import {Club} from '../clubs/club.model';
import {Game} from '../games/game.model';
import {Event} from '../events/event.model';

export interface TeamInterface extends EntityInterface {
  name: string;
  imgProfile?: string;
  club: Club;
  events: Event[];
  games: Game[];
}

export class Team extends AbstractEntity implements TeamInterface {
  public name: string = null;
  public imgProfile?: string = null;
  public club: Club = null;
  public events: Event[] = null;
  public games: Game[] = null;

  public static override getEntityName(): 'team' {
    return 'team';
  }
}
