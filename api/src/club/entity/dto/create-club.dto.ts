import { IsOptional, IsString } from 'class-validator';

export class CreateClubDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imgProfile?: string;

  @IsString()
  city: string;
}
