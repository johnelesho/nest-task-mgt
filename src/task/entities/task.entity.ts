import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums/task-status';
import { User } from "../../users/entities/user.entity";
import { AbstractEntity } from "../../abstract.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Task  extends AbstractEntity {
  @Column({unique: true})
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ManyToOne(() => User , (user) => user.tasks, {eager: false, onDelete: "CASCADE"})
 @Exclude()
  user: User;

  @Column()
  userId: string;
}
