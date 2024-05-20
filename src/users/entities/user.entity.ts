import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { UserRole } from '../enums/user-role';
import { Task } from "../../task/entities/task.entity";
import { AbstractEntity } from "../../abstract.entity";

import { Express } from "express";
@Entity()
export class User  extends AbstractEntity implements Express.User{

  @Column()
  firstName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany((type) => Task, (task) => task.user, { onDelete:"CASCADE"})
  tasks: Task[];

}
