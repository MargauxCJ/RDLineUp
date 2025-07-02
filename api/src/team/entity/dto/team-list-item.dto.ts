import {IsNumber, isNumber, IsString} from 'class-validator';
import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class TeamListItemDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;
}
