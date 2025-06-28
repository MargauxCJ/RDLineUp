import {Exclude, Expose, Type} from 'class-transformer';
import {ClubEntity} from 'src/club/entity/club.entity';
import {ClubSubDto} from 'src/club/entity/dto/club-sub.dto';

@Exclude()
export class TeamListSubDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  @Type(() => ClubSubDto)
  club: ClubSubDto;
}
