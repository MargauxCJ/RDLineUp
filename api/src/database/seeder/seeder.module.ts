import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SeederService} from './seeder.service';
import {typeOrmConfig} from 'src/config/typeorm.config';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
    ]),
  ],
  providers: [
    SeederService,
  ],
})
export class SeederModule {}
