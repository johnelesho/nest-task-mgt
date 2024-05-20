import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  public id: string;

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  public updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  public deletedAt: Date;

  @Column({ default: 'anonymous' })
  public createdBy: string;
  @Column({ default: 'anonymous’]' })
  public updatedBy: string;
}
