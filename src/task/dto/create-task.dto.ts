import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TaskStatus } from "../enums/task-status";

export class CreateTaskDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

}
