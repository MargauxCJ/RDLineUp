import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from } from 'rxjs';
import * as bcrypt from 'bcrypt';
import {UserEntity} from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: UserEntity): Observable<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return from(this.jwtService.signAsync(payload));
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  comparePasswords(
    newPassword: string,
    passwordHash: string,
  ): Observable<boolean> {
    return from(bcrypt.compare(newPassword, passwordHash));
  }

  generateTemporaryToken(userId: number): string {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '24h' });
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

}
