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
import {GameEntity} from '../../game/entity/game.entity';

export enum UserRole {
  ADMIN = 'admin',
  COACH_USER = 'coach',
  MEMBER_USER = 'member',
}

export enum MemberPosition {
  PIVOT = 'pivot',
  BLOCKER = 'blocker',
  JAMMER = 'jammer',
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;


  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER_USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserRole, default: MemberPosition.BLOCKER })
  defaultPosition: MemberPosition;

  @Column({ nullable: true })
  surname: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => UserEntity, (user) => user.team)
  @JoinColumn({ name: 'teamId' })
  team: TeamEntity;

  @ManyToMany(() => EventEntity, (event) => event.presentMembers)
  events: UserEntity[]

  @ManyToMany(() => GameEntity, (game) => game.players)
  games: GameEntity[]


  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  addTimeStamp() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }
}
