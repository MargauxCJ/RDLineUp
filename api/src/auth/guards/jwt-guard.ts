import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entity/user.entity';
import { firstValueFrom } from 'rxjs';
import {UserService} from 'src/user/services/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const userPayload = request.user;

    if (!userPayload?.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const fullUser = await firstValueFrom(
      this.userService.findOneByField(
        'id',
        userPayload.id,
        'NOT_FOUND',
        undefined,
        ['teams'],
      )
    );

    request.user = fullUser as UserEntity;

    return result as boolean;
  }
}
