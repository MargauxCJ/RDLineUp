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
import {BaseEntity} from 'src/common/entities/base.entity';

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

@Entity('member')
export class UserEntity extends BaseEntity {
  @Column()
  password: string;

  @Column({ nullable: true })
  imgProfile?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER_USER })
  role: UserRole;

  @Column({ type: 'enum', enum: MemberPosition, default: MemberPosition.BLOCKER })
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
}
