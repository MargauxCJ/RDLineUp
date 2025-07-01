import {IsOptional, IsPositive, IsString, Min} from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  page?: number = 1;  // page par défaut à 1

  @IsOptional()
  @Min(1)
  limit?: number = 10; // limite par défaut à 10

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  teamId?: string;
}
