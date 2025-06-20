import {AbstractEntity, EntityInterface} from '../entity';
import {Team} from '../teams/team.model';

export interface ClubInterface extends EntityInterface {
  name: string;
  imgProfile?: string;
  city: string;
  teams: Team[];
}

export class Club extends AbstractEntity implements ClubInterface {
  name: string = null;
  imgProfile?: string = null;
  city: string = null;
  teams: Team[] = null;

  public static override getEntityName(): 'club' {
    return 'club';
  }
}
