import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { GameEntity } from '../../game/entity/game.entity';
import {BaseEntity} from 'src/common/entities/base.entity';

@Entity('pair')
export class PairEntity extends BaseEntity {

  @ManyToOne(() => UserEntity)
  player1: UserEntity;

  @ManyToOne(() => UserEntity)
  player2: UserEntity;

  @ManyToOne(() => GameEntity, (game) => game.pairs)
  game: GameEntity;
}
