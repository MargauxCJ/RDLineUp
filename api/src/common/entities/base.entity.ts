import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity as TypeORMBaseEntity, Column, BeforeInsert, BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  addTimeStamp() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }
}
