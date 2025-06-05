import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from 'typeorm';
import {ClubEntity} from '../../club/entity/club.entity';
import {UserEntity} from '../../user/entity/user.entity';
import {EventEntity} from '../../event/entity/event.entity';
import {GameEntity} from '../../game/entity/game.entity';

@Entity('team')
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  imgProfile?: string;

  @ManyToOne(() => ClubEntity, (club) => club.teams)
  @JoinColumn({ name: 'clubId' })
  club: ClubEntity;

  @OneToMany(() => UserEntity, (user) => user.team)
  members: UserEntity[];

  @ManyToMany(() => EventEntity, (event) => event.teams)
  events: EventEntity[];

  @OneToMany(() => GameEntity, (game) => game.team)
  games: GameEntity[];
}
