import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SeederService} from './seeder.service';
import {typeOrmConfig} from 'src/config/typeorm.config';
import {ConfigModule} from '@nestjs/config';
import {ClubEntity} from 'src/club/entity/club.entity';
import {TeamEntity} from 'src/team/entity/team.entity';
import {ClubModule} from 'src/club/club.module';
import {TeamModule} from 'src/team/team.module';
import {ClubService} from 'src/club/services/club.service';
import {ClubSeeder} from 'src/database/seeder/seeders/club.seeder';
import {TeamSeeder} from 'src/database/seeder/seeders/team.seeder';
import {UserEntity} from 'src/user/entity/user.entity';
import {UserModule} from 'src/user/user.module';
import {MemberSeeder} from 'src/database/seeder/seeders/member.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      ClubEntity,
      TeamEntity,
      UserEntity,
    ]),
    ClubModule,
    TeamModule,
    UserModule,
  ],
  providers: [
    SeederService,
    ClubSeeder,
    TeamSeeder,
    MemberSeeder,
  ],
})
export class SeederModule {}
