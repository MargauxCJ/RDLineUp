import {IsArray, IsDate, IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateEventDto {
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
  presentMembersIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  gamesIds?: number[];
}
