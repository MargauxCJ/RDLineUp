import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {CurrentUserDto} from 'src/user/entity/dto/current-user.dto';

export interface JwtUserPayload {
  id: number;
  email: string;
  role: string;
  surname: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
    console.log('JWT Secret:', configService.get('JWT_SECRET'));
  }
  async validate(payload: any): Promise<JwtUserPayload> {
    return {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role,
      surname: payload.surname,
    };
  }
}
