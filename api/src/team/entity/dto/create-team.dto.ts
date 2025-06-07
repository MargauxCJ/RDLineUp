import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imgProfile?: string;

  @IsNotEmpty()
  @IsNumber()
  clubId: number;
}
