import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {TeamEntity} from '../../team/entity/team.entity';
import {EventEntity} from '../../event/entity/event.entity';
import {UserEntity} from '../../user/entity/user.entity';
import {JamEntity} from '../../jam/entity/jam.entity';

@Entity('lineup')
export class LineUpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => JamEntity, (jam) => jam.lineUp)
  jams: JamEntity[];



  @BeforeInsert()
  addTimeStamp() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }
}
