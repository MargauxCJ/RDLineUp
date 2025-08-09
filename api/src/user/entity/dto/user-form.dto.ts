import {Exclude, Expose, Type} from 'class-transformer';
import {MemberPosition, UserRole} from 'src/user/entity/user.entity';
import {TeamListSubDto} from 'src/team/entity/dto/team-list-sub.dto';

@Exclude()
export class UserFormDto {
  @Expose()
  id: number;

  @Expose()
  surname: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: string;

  @Expose()
  jerseyNum: string;

  @Expose()
  role: UserRole;

  @Expose()
  enabled: boolean;

  @Expose()
  imgProfile: string;

  @Expose()
  defaultPosition: MemberPosition;

  @Expose()
  @Type(() => TeamListSubDto)
  teams: TeamListSubDto[];

  @Expose()
  get teamIds(): number[] {
    return this.teams?.map(t => t.id) ?? [];
  }
}
