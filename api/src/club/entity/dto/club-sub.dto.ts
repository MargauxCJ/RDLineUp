import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ClubSubDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
