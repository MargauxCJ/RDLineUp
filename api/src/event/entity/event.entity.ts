import {Column, Entity, ManyToMany, OneToMany,} from 'typeorm';
import {TeamEntity} from '../../team/entity/team.entity';
import {UserEntity} from '../../user/entity/user.entity';
import {GameEntity} from '../../game/entity/game.entity';
import {BaseEntity} from 'src/common/entities/base.entity';

@Entity('event')
export class EventEntity extends BaseEntity{
  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , nullable: true})
  endDate: Date;

  @ManyToMany(() => TeamEntity, (team) => team.events)
  teams: TeamEntity[];

  @ManyToMany(() => UserEntity, (user) => user.events)
  presentMembers: UserEntity[];

  @OneToMany(() => GameEntity, (game) => game.event)
  games: GameEntity[];
}
