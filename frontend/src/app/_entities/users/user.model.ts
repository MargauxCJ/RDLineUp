import {AbstractEntity, EntityInterface} from '../entity';

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
  // team: Team;
  // events: Event[];
  // games: Game[];
}

export class User extends AbstractEntity implements UserInterface {
  surname: string = null;
  email: string = null;
  password?: string = null;
  imgProfile?: string = null;
  role: UserRole = null;
  defaultPosition: MemberPosition = null;
  jerseyNum?: string = null;
  // team: Team;
  // events: Event[];
  // games: Game[];

  public static override getEntityName(): 'user' {
    return 'user';
  }
}
