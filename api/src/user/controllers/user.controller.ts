import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { map, Observable } from 'rxjs';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from 'src/user/entity/dto/create-user.dto';
import { LoginDto } from 'src/user/entity/dto/login.dto';
import {CurrentUser} from 'src/auth/decorator/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current-user')
  getCurrentUser(@CurrentUser() user: any) {
    return this.userService.findCurrentUser(user.id);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Observable<{ access_token: string }> {
    return this.userService.login(loginDto).pipe(
      map((jwt: string) => ({ access_token: jwt })),
    );
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<any> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll(): Observable<UserEntity[]> {
    return this.userService.findAll();
  }

  // ici on force à parser un nombre pour éviter que 'login' match ici
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneByField('id', +id);
  }
}
