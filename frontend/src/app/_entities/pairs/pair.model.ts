import {AbstractEntity, EntityInterface} from '../entity';
import {User} from '../users/user.model';
import {Game} from '../games/game.model';

export interface PairInterface extends EntityInterface {
  player1: User;
  player2: User;
  game: Game;
}

export class Pair extends AbstractEntity implements PairInterface {
  public player1: User = null;
  public player2: User = null;
  public game: Game = null;

  public static override getEntityName(): 'pair' {
    return 'pair';
  }
}
