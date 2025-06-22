import {Exclude, Expose, Type} from 'class-transformer';
import {UserRole} from 'src/user/entity/user.entity';
import {TeamListSubDto} from 'src/team/entity/dto/team-list-sub.dto';

@Exclude()
export class UsersListDto {
  @Expose()
  id: number;

  @Expose()
  surname: string;

  @Expose()
  email: string;

  @Expose()
  jerseyNum: string;

  @Expose()
  role: UserRole;

  @Expose()
  @Type(() => TeamListSubDto)
  teams: TeamListSubDto[];

  @Expose()
  get teamIds(): number[] {
    return this.teams?.map(t => t.id) ?? [];
  }
}
