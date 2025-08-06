import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany,} from 'typeorm';
import {TeamEntity} from '../../team/entity/team.entity';
import {EventEntity} from '../../event/entity/event.entity';
import {UserEntity} from '../../user/entity/user.entity';
import {PairEntity} from '../../pair/entity/pair.entity';
import {BaseEntity} from 'src/common/entities/base.entity';

@Entity('game')
export class GameEntity extends BaseEntity {

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  schedule: Date;

  @ManyToOne(() => TeamEntity, (team) => team.games)
  @JoinColumn({ name: 'teamId' })
  team: TeamEntity;

  @Column()
  opponentTeam: string;

  @Column()
  notes: string;

  @ManyToOne(() => EventEntity, (event) => event.games)
  event: EventEntity

  @ManyToMany(() => UserEntity, (user) => user.games)
  players: UserEntity[]

  @OneToMany(() => PairEntity, (pair) => pair.game, { cascade: true })
  pairs: PairEntity[];
}
