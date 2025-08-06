import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany,} from 'typeorm';
import {TeamEntity} from 'src/team/entity/team.entity';
import {UserEntity} from 'src/user/entity/user.entity';
import {GameEntity} from 'src/game/entity/game.entity';
import {BaseEntity} from 'src/common/entities/base.entity';
import {ClubEntity} from 'src/club/entity/club.entity';

@Entity('event')
export class EventEntity extends BaseEntity{
  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , nullable: true})
  endDate: Date;

  @ManyToOne(() => ClubEntity, (club) => club.teams)
  @JoinColumn({ name: 'clubId' })
  club: ClubEntity;

  @ManyToMany(() => TeamEntity, (team) => team.events, {cascade: true})
  @JoinTable()
  teams: TeamEntity[];

  @ManyToMany(() => UserEntity, (user) => user.events, {cascade: true})
  @JoinTable()
  presentMembers: UserEntity[];

  @OneToMany(() => GameEntity, (game) => game.event)
  games: GameEntity[];
}
