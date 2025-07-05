import {IsEmail, IsEnum} from 'class-validator';
import {UserRole} from 'src/user/entity/user.entity';
import {Exclude, Expose, Type} from 'class-transformer';
import {TeamListSubDto} from 'src/team/entity/dto/team-list-sub.dto';

@Exclude()
export class CurrentUserDto {
  @Expose()
  id: number;

  @Expose()
  surname: string;

  @Expose()
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  @Expose()
  role: string;

  @Expose()
  imgProfile: string;

  @Expose()
  @Type(() => TeamListSubDto)
  teams: TeamListSubDto[];
  @Expose()
  get teamIds(): number[] {
    return this.teams?.map(t => t.id) ?? [];
  }
}
