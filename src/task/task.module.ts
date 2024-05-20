import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";

@Module({
  controllers: [TaskController],
  imports: [TypeOrmModule.forFeature([Task]), UsersModule],
  providers: [TaskService],
})
export class TaskModule {}
