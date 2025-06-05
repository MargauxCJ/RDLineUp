import { DataSourceOptions } from 'typeorm';
import {ClubEntity} from '../club/entity/club.entity';
import {ClubModule} from '../club/club.module';
import {UserModule} from '../user/user.module';
import {TeamModule} from '../team/team.module';
import {EventModule} from '../event/event.module';
import {GameModule} from '../game/game.module';
import {LineUpModule} from '../line-up/line-up.module';
import {JamModule} from '../jam/jam.module';
import {PairModule} from '../pair/pair.module';
import {UserEntity} from '../user/entity/user.entity';
import {TeamEntity} from '../team/entity/team.entity';
import {EventEntity} from '../event/entity/event.entity';
import {GameEntity} from '../game/entity/game.entity';
import {LineUpEntity} from '../line-up/entity/line-up.entity';
import {JamEntity} from '../jam/entity/jam.entity';
import {PairEntity} from '../pair/entity/pair.entity';
export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [
    ClubEntity,
    UserEntity,
    TeamEntity,
    EventEntity,
    GameEntity,
    LineUpEntity,
    JamEntity,
    PairEntity,
  ],
};
