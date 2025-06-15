import {IsEmail, IsEnum} from 'class-validator';
import {UserRole} from 'src/user/entity/user.entity';
import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class CurrentUserDto {

  @Expose()
  id: number;

  @Expose()
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  @Expose()
  role: string;
}
