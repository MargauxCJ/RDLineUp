import { Injectable } from '@nestjs/common';

// @ts-ignore
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}