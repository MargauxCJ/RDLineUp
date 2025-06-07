import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { map, Observable } from 'rxjs';
import {UserEntity} from 'src/user/entity/user.entity';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user: UserEntity = request.user.user;

    return this.userService.findOneByField('id', user.id).pipe(
      map((user: UserEntity) => {
        let hasPermission = false;

        if (user.id === Number(params.id)) {
          hasPermission = true;
        }
        return user && hasPermission;
      }),
    );
  }
}
