import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt-guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './guards/jwt-strategy';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1000s' },
      }),
    }),
  ],
  providers: [AuthService, JwtAuthGuard, RolesGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
