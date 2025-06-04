import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {TeamEntity} from '../../team/entity/team.entity';
import {EventEntity} from '../../event/entity/event.entity';
import {UserEntity} from '../../user/entity/user.entity';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  schedule: Date;

  @ManyToOne(() => TeamEntity, (team) => team.games)
  @JoinColumn({ name: 'teamId' })
  team: TeamEntity;

  @Column()
  opponentTeam: string;

  @ManyToOne(() => EventEntity, (event) => event.games)
  event: EventEntity

  @ManyToMany(() => UserEntity, (user) => user.games)
  players: UserEntity[]


  @BeforeInsert()
  addTimeStamp() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }
}
