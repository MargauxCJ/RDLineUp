import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { GameEntity } from '../../game/entity/game.entity';

@Entity('pair')
export class PairEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  player1: UserEntity;

  @ManyToOne(() => UserEntity)
  player2: UserEntity;

  @ManyToOne(() => GameEntity, (game) => game.pairs)
  game: GameEntity;
}
