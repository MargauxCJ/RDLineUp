import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {CurrentUserDto} from 'src/user/entity/dto/current-user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as CurrentUserDto;
  },
);
