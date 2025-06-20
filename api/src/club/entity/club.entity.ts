import {Column, Entity, OneToMany,} from 'typeorm';
import {TeamEntity} from '../../team/entity/team.entity';
import {BaseEntity} from 'src/common/entities/base.entity';

@Entity('club')
export class ClubEntity extends BaseEntity{
  @Column()
  name: string;

  @Column({ nullable: true })
  imgProfile?: string;

  @Column()
  city: string;

  @OneToMany(() => TeamEntity, (team) => team.club)
  teams: TeamEntity[];
}
