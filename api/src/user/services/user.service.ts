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
import {FindOptionsWhere, ILike, In, Repository} from 'typeorm';
import { MessageService } from 'src/common/services/message/message.service';
import {catchError, from, map, Observable, switchMap, throwError} from 'rxjs';
import {ClassConstructor, instanceToPlain, plainToInstance} from 'class-transformer';
import {AuthService} from 'src/auth/services/auth.service';
import {CreateUserDto} from 'src/user/entity/dto/create-user.dto';
import {LoginDto} from 'src/user/entity/dto/login.dto';
import {CurrentUserDto} from 'src/user/entity/dto/current-user.dto';
import {TeamEntity} from 'src/team/entity/team.entity';
import {PaginatedResultDto} from 'src/common/entities/paginatedResult.dto';
import {UsersListDto} from 'src/user/entity/dto/users-list.dto';
import {UserFormDto} from 'src/user/entity/dto/user-form.dto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
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
        const userToCreate = {
          ...user,
          password: passwordHash,
        };

        if (user.teamIds && user.teamIds.length > 0) {
          return from(
            this.teamRepository.find({
              where: { id: In(user.teamIds) },
            }),
          ).pipe(
            switchMap((teams) => {
              const newUser = this.userRepository.create({
                ...userToCreate,
                teams,
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
        } else {
          const newUser = this.userRepository.create(userToCreate);
          return from(this.userRepository.save(newUser)).pipe(
            map((savedUser) => {
              const { password, ...result } = savedUser;
              return instanceToPlain(result);
            }),
            this.handleError<any>(),
          );
        }
      }),
    );
  }


  findCurrentUser(id: number): Observable<CurrentUserDto> {
    return from(
      this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.teams', 'team')
        .leftJoinAndSelect('team.club', 'club')
        .where('user.id = :id', { id })
        .getOne(),
    ).pipe(
      map(user => {
        if (!user) {
          throw new NotFoundException(this.messageService.get('NOT_FOUND', 'Utilisateur'));
        }

        return this.mapToPlain(user, CurrentUserDto);
      }),
      catchError(err => {
        if (err instanceof HttpException) return throwError(() => err);

        console.error(err);
        return throwError(() => new InternalServerErrorException(this.messageService.get('SERVER_ERROR')));
      }),
    );
  }
  updateProfileImage(userId: number, file: Express.Multer.File) {
    return this.updateImage(
      userId,
      'imgProfile',
      file,
      'users/profile-image',
      'default.jpg'
    );
  }

  getUserFormById(id: number): Observable<UserFormDto> {
    return this.findOneByField(
      'id',
      id,
      'USER_NOT_FOUND',
      (user) => plainToInstance(UserFormDto, user),
      ['teams']
    );
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

  public findAllPaginatedWithFilters(
    page: number = 1,
    limit: number = 10,
    relations: string[] = [],
    search?: string,
    teamId?: string,
  ): Observable<PaginatedResultDto<UsersListDto>> {
    const where: FindOptionsWhere<UserEntity> = {};

    if (teamId) {
      // Filtrer par équipe via relation (assure-toi que ta relation s'appelle bien 'teams')
      where['teams'] = { id: teamId } as any;
    }

    if (search) {
      // Filtrer par nom (insensible à la casse)
      where['surname'] = ILike(`%${search}%`);
    }

    return this.findAllPaginated(
      UsersListDto,
      page,
      limit,
      relations,
      where,
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
