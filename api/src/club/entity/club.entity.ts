import {
  BeforeInsert,
  Column,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {TeamEntity} from '../../team/entity/team.entity';

@Entity('club')
export class ClubEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  name: string;

  @Column({ nullable: true })
  imgProfile?: string;

  @OneToMany(() => TeamEntity, (team) => team.club)
  teams: TeamEntity[];

  @BeforeInsert()
  addTimeStamp() {
    this.createdAt = new Date();
  }
}
