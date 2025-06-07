import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import {MemberPosition, UserRole} from 'src/user/entity/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(MemberPosition)
  defaultPosition?: MemberPosition;

  @IsOptional()
  @IsString()
  imgProfile?: string;

  @IsOptional()
  teamId?: number;
}
