import {Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { map, Observable } from 'rxjs';
import {UserEntity, UserRole} from '../entity/user.entity';
import { CreateUserDto } from 'src/user/entity/dto/create-user.dto';
import { LoginDto } from 'src/user/entity/dto/login.dto';
import {CurrentUser} from 'src/auth/decorator/current-user.decorator';
import {JwtAuthGuard} from 'src/auth/guards/jwt-guard';
import {CurrentUserDto} from 'src/user/entity/dto/current-user.dto';
import {RolesGuard} from 'src/auth/guards/roles.guard';
import {hasRoles} from 'src/auth/decorator/roles.decorator';

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
  @Get()
  findAll(): Observable<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneByField('id', +id);
  }
}
