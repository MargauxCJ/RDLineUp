import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  Query, Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {map, Observable, of} from 'rxjs';
import {CreateUserDto} from 'src/user/entity/dto/create-user.dto';
import {LoginDto} from 'src/user/entity/dto/login.dto';
import {CurrentUser} from 'src/auth/decorator/current-user.decorator';
import {JwtAuthGuard} from 'src/auth/guards/jwt-guard';
import {CurrentUserDto} from 'src/user/entity/dto/current-user.dto';
import {UsersListDto} from 'src/user/entity/dto/users-list.dto';
import {PaginatedResultDto} from 'src/common/entities/paginatedResult.dto';
import {PaginationQueryDto} from 'src/common/entities/paginationQuery.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {uploadConfig} from 'src/common/utils/upload.utils';
import {UserFormDto} from 'src/user/entity/dto/user-form.dto';
import {UserEntity} from 'src/user/entity/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  getCurrentUser(@CurrentUser() user: CurrentUserDto): Observable<CurrentUserDto> {
    console.log(user);
    return this.userService.findCurrentUser(user.id);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Observable<{ access_token: string }> {
    return this.userService.login(loginDto).pipe(
      map((jwt: string) => ({ access_token: jwt })),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<any> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() user: UserEntity,
  ): Observable<any> {
    return this.userService.updateOneByField('id', id, user);
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Observable<UsersListDto[]> {
    return this.userService.findAll(UsersListDto, ['teams']);
  }

  @Get('paginated')
  findAllPaginated(
    @Query() paginationQuery: PaginationQueryDto,
  ): Observable<PaginatedResultDto<UsersListDto>> {
    return this.userService.findAllPaginatedWithFilters(
      paginationQuery.page,
      paginationQuery.limit,
      ['teams'],
      paginationQuery.search,
      paginationQuery.teamId,
    );
  }

  @Get(':id')
  getUserFormById(@Param('id', ParseIntPipe) id: number): Observable<UserFormDto> {
    return this.userService.getUserFormById(id);
  }

  @Post('upload/:userId')
  @UseInterceptors(FileInterceptor('file', uploadConfig('users/profile-image')))
  uploadImgProfile(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Observable<{ imgProfile: string }> {
    return this.userService.updateProfileImage(Number(userId), file);
  }

  @Get('profile-image/:imagename')
  findImgProfile(
    @Param('imagename') imagename,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(`${process.cwd()}/uploads/users/profile-image/${imagename}`),
    );
  }
}
