import {IsArray, IsDate, IsNumber, IsOptional, IsString} from 'class-validator';

export class EventsListDto {
  @IsString()
  name: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  teamIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  gamesIds?: number[];
}
