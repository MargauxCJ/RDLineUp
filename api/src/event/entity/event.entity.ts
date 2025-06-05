import {BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn,} from 'typeorm';
import {TeamEntity} from '../../team/entity/team.entity';
import {UserEntity} from '../../user/entity/user.entity';
import {GameEntity} from '../../game/entity/game.entity';

@Entity('event')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , nullable: true})
  endDate: Date;

  @ManyToMany(() => TeamEntity, (team) => team.events)
  teams: TeamEntity[];

  @ManyToMany(() => UserEntity, (user) => user.events)
  presentMembers: UserEntity[]

  @OneToMany(() => GameEntity, (game) => game.event)
  games: GameEntity

  @BeforeInsert()
  addTimeStamp() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }
}
