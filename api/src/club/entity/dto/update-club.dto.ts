import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateClubDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsUrl({}, { message: 'imgProfile must be a valid URL' })
  imgProfile?: string;
}
