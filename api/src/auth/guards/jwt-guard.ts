import {ExecutionContext, Injectable} from '@nestjs/common';

// @ts-ignore
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard activated');
    return super.canActivate(context);
  }
}
