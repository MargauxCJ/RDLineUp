import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from 'src/common/services/message/message.service';
import {catchError, from, map, Observable, switchMap, throwError} from 'rxjs';
import {instanceToPlain} from 'class-transformer';
import {AuthService} from 'src/auth/services/auth.service';
import {CreateUserDto} from 'src/user/entity/dto/create-user.dto';
import {LoginDto} from 'src/user/entity/dto/login.dto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    messageService: MessageService,
    private authService: AuthService,
  ) {
    super(userRepository, messageService, 'User');
  }

  login(user: LoginDto): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((validatedUser: UserEntity | null) => {
        if (!validatedUser) {
          throw new UnauthorizedException(
            this.messageService.get('LOGIN_PASSWORD_FAILED'),
          );
        }

        return this.authService.generateJWT(validatedUser);
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }

        console.error(err);
        return throwError(
          () =>
            new InternalServerErrorException(
              this.messageService.get('SERVER_ERROR'),
            ),
        );
      }),
    );
  }

  public createUser(user: CreateUserDto): Observable<any> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = this.userRepository.create({
          ...user,
          password: passwordHash,
        });

        return from(this.userRepository.save(newUser)).pipe(
          map((savedUser) => {
            const { password, ...result } = savedUser;
            return instanceToPlain(result);
          }),
          this.handleError<any>(),
        );
      }),
    );
  }

  findCurrentUser(id: number): Observable<UserEntity> {
    return from(
      this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne(),
    ).pipe(
      map((user) => {
        if (!user) {
          throw new NotFoundException(
            this.messageService.get('NOT_FOUND', 'Utilisateur'),
          );
        }
        return instanceToPlain(user);
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }
        console.error(err);
        return throwError(
          () =>
            new InternalServerErrorException(
              this.messageService.get('SERVER_ERROR'),
            ),
        );
      }),
    ) as Observable<UserEntity>;
  }


  validateUser(email: string, password: string): Observable<UserEntity> {
    return this.findByMail(email).pipe(
      switchMap((user: UserEntity | undefined) => {
        if (!user) {
          throw new NotFoundException(
            this.messageService.get('EMAIL_NOT_FOUND'),
          );
        }

        return this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result as UserEntity;
            } else {
              throw new UnauthorizedException(
                this.messageService.get('LOGIN_PASSWORD_FAILED'),
              );
            }
          }),
        );
      }),
    );
  }

  findByMail(email: string): Observable<UserEntity> {
    return from(this.userRepository.findOneBy({ email })).pipe(
      map((user: UserEntity | null) => {
        if (!user) {
          throw new NotFoundException(
            this.messageService.get('EMAIL_NOT_FOUND'),
          );
        }
        return user;
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }
        console.error(err);
        return throwError(
          () =>
            new InternalServerErrorException(
              this.messageService.get('SERVER_ERROR'),
            ),
        );
      }),
    );
  }
}
