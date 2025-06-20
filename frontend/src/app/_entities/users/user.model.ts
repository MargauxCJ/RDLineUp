import {AbstractEntity, EntityInterface} from '../entity';
import {Team} from '../teams/team.model';
import {Game} from '../games/game.model';

export enum UserRole {
  ADMIN = 'admin',
  COACH_USER = 'front',
  MEMBER_USER = 'band',
}

export enum MemberPosition {
  PIVOT = 'pivot',
  BLOCKER = 'blocker',
  JAMMER = 'jammer',
}

export interface UserInterface extends EntityInterface {
  surname: string;
  email: string;
  password?: string;
  imgProfile?: string;
  role: UserRole;
  defaultPosition: MemberPosition;
  jerseyNum?: string;
  teams: Team[];
  events: Event[];
  games: Game[];
}

export class User extends AbstractEntity implements UserInterface {
  public surname: string = null;
  public email: string = null;
  public password?: string = null;
  public imgProfile?: string = null;
  public role: UserRole = null;
  public defaultPosition: MemberPosition = null;
  public jerseyNum?: string = null;
  public teams: Team[];
  public events: Event[];
  public games: Game[];

  public static override getEntityName(): 'user' {
    return 'user';
  }
}
