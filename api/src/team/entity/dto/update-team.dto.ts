import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  imgProfile?: string;

  @IsOptional()
  @IsNumber()
  clubId?: number;
}
