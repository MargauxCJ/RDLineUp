import {Entity, OneToMany,} from 'typeorm';
import {JamEntity} from '../../jam/entity/jam.entity';
import {BaseEntity} from 'src/common/entities/base.entity';

@Entity('lineup')
export class LineUpEntity extends BaseEntity {
  @OneToMany(() => JamEntity, (jam) => jam.lineUp)
  jams: JamEntity[];
}
