import {UserEntity} from '../../user/entity/user.entity';
import {PairEntity} from '../../pair/entity/pair.entity';
import {Entity, ManyToOne} from 'typeorm';
import {LineUpEntity} from '../../line-up/entity/line-up.entity';
import {BaseEntity} from 'src/common/entities/base.entity';

@Entity('jam')
export class JamEntity extends BaseEntity {

  @ManyToOne(() => LineUpEntity, (lineup) => lineup.jams)
  lineUp: LineUpEntity;

  @ManyToOne(() => PairEntity)
  pair1: PairEntity;

  @ManyToOne(() => PairEntity)
  pair2: PairEntity;

  @ManyToOne(() => UserEntity)
  jammer: UserEntity;
}
