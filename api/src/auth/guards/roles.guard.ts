import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/user/services/user.service';
import {UserEntity} from 'src/user/entity/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    return this.userService.findOneByField('id', user.id).pipe(
      map((user: UserEntity) => {
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermission: boolean = false;

        if (hasRole()) {
          hasPermission = true;
        }
        return user && hasPermission;
      }),
    );
  }
}
