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
import {DeepPartial, FindOptionsWhere, ILike, In, Repository} from 'typeorm';
import { MessageService } from 'src/common/services/message/message.service';
import {catchError, from, map, Observable, of, switchMap, throwError} from 'rxjs';
import {ClassConstructor, instanceToPlain, plainToInstance} from 'class-transformer';
import {AuthService} from 'src/auth/services/auth.service';
import {CreateUserDto} from 'src/user/entity/dto/create-user.dto';
import {LoginDto} from 'src/user/entity/dto/login.dto';
import {CurrentUserDto} from 'src/user/entity/dto/current-user.dto';
import {TeamEntity} from 'src/team/entity/team.entity';
import {PaginatedResultDto} from 'src/common/entities/paginatedResult.dto';
import {UsersListDto} from 'src/user/entity/dto/users-list.dto';
import {UserFormDto} from 'src/user/entity/dto/user-form.dto';
import * as path from 'node:path';
import * as fs from 'node:fs';


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

  override updateOneByField(
    field: keyof UserEntity,
    value: any,
    updateData: DeepPartial<UserEntity>,
    notFoundMessage = 'NOT_FOUND',
  ): Observable<any> {
    return this.findOneByField(field, value, notFoundMessage).pipe(
      switchMap((existingUser) => {
        const previousImage = existingUser.imgProfile;
        const isRemovingPhoto = updateData.imgProfile === null;

        if (
          isRemovingPhoto &&
          previousImage
        ) {
          const fileName = path.basename(previousImage);
          const oldPath = path.join(process.cwd(), 'uploads', 'users', 'profile-image', fileName);

          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.warn('❌ Erreur suppression image :', err);
            }
          }
        }

        return super.updateOneByField(field, value, updateData, notFoundMessage);
      })
    );
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

  public createUser(user: CreateUserDto): Observable<{ user: any; token?: string }> {
    const hasPassword = !!user.password;

    const hashOrNull$ = hasPassword
      ? this.authService.hashPassword(user.password!)
      : of(null);

    return hashOrNull$.pipe(
      switchMap((passwordHash: string | null) => {
        const userToCreate = {
          ...user,
          password: passwordHash,
        };

        const createAndSaveUser = (teams = []) => {
          const newUser = this.userRepository.create({
            ...userToCreate,
            teams,
          });

          return from(this.userRepository.save(newUser)).pipe(
            map((savedUser) => {
              const { password, ...userWithoutPassword } = savedUser;

              let token: string | undefined;
              if (!hasPassword) {
                token = this.authService.generateTemporaryToken(savedUser.id);
              }

              return {
                user: instanceToPlain(userWithoutPassword),
                token,
              };
            }),
            this.handleError<any>(),
          );
        };

        if (user.teamIds && user.teamIds.length > 0) {
          return from(
            this.teamRepository.find({
              where: { id: In(user.teamIds) },
            }),
          ).pipe(switchMap((teams) => createAndSaveUser(teams)));
        }

        return createAndSaveUser();
      }),
    );
  }

  setPasswordFromToken(token: string, newPassword: string): Observable<any> {
    const payload = this.authService.verifyToken(token);
    const userId = payload.sub;

    return this.authService.hashPassword(newPassword).pipe(
      switchMap((hashedPassword) => {
        return this.updateOneByField('id', userId, {
          password: hashedPassword,
        });
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
  updateProfileImage(userId: number, file: Express.Multer.File): Observable<{ imgProfile: string }> {
    return this.updateImage(
      userId,
      'imgProfile',
      file,
      'users/profile-image'
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
    currentUser: UserEntity,
    page: number = 1,
    limit: number = 10,
    relations: string[] = [],
    search?: string,
    teamId?: string,
    status?: boolean,
  ): Observable<PaginatedResultDto<UsersListDto>> {
    const where: FindOptionsWhere<UserEntity> = {};

    if (teamId) where['teams'] = { id: teamId } as any;
    if (search) where['surname'] = ILike(`%${search}%`);
    if (status !== undefined) where['enabled'] = status;

    return this.findAllPaginated(
      UsersListDto,
      page,
      limit,
      relations,
      where,
      currentUser,
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
