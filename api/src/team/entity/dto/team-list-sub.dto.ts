import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class TeamListSubDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
