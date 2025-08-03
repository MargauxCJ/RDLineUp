import {BeforeInsert, Column, Entity, JoinTable, ManyToMany,} from 'typeorm';
import {TeamEntity} from '../../team/entity/team.entity';
import {EventEntity} from '../../event/entity/event.entity';
import {GameEntity} from '../../game/entity/game.entity';
import {BaseEntity} from 'src/common/entities/base.entity';
import {Exclude} from 'class-transformer';

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
  @Exclude()
  password: string;

  @Column({ nullable: true })
  imgProfile?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER_USER })
  role: UserRole;

  @Column({ type: 'enum', enum: MemberPosition, default: MemberPosition.BLOCKER })
  defaultPosition: MemberPosition;

  @Column()
  surname: string;

  @Column({nullable: true})
  jerseyNum: string;

  @Column({ unique: true })
  email: string;

  @Column({default: true})
  enabled: boolean;

  @ManyToMany(() => TeamEntity, (team) => team.members)
  @JoinTable()
  teams: TeamEntity[];

  @ManyToMany(() => EventEntity, (event) => event.presentMembers)
  events: EventEntity[]

  @ManyToMany(() => GameEntity, (game) => game.players)
  games: GameEntity[]

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
