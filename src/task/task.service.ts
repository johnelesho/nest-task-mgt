import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiResponse } from '../ApiResponse';
import { TASK_PAGINATE_CONFIG } from "../constants";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { TaskStatus } from "./enums/task-status";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
     private userService: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<ApiResponse> {
    let owner = await this.fetchCurrentlyLoggedInUser(userId);
    let task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.status = createTaskDto.status;
    task.user = owner;
    let { user, ...response} = await this.taskRepository.save(task);
    return new ApiResponse(response);
  }

  private async fetchCurrentlyLoggedInUser(userId: string) {
    let owner = await this.userService.findOne(userId);
    if (!owner) {
      throw new BadRequestException("Invalid User");
    }
    return owner;
  }

  async findAll(query: PaginateQuery): Promise<ApiResponse> {
    const data = await paginate(query, this.taskRepository, TASK_PAGINATE_CONFIG);
    return new ApiResponse(data);
  }

  async findOne(id: string):Promise<ApiResponse>  {
  const found =await this.findById(id);

    return new ApiResponse(found);
  }
  async changeTaskStatus(id: string, status: TaskStatus, userId: any):Promise<ApiResponse>  {
  let found =await this.findById(id);
  if(found.status == status){
    throw new BadRequestException(`Task status is already ${status}`)
  }
  if(found.userId != userId){
    throw new UnauthorizedException("You can only change status of your own task")
  }
  found.status = status;
  found = await this.taskRepository.save(found);
    return new ApiResponse(found);
  }
  async findById(id: string):Promise<Task>  {
    const found = await this.taskRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

 return found;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: any): Promise<ApiResponse> {
    const task = await this.findById(id);
    if(task.userId != userId){
      throw new UnauthorizedException("You can only make changes to your own task")
    }
    Object.assign(task, updateTaskDto);
    console.log(task);
    const response = await this.taskRepository.save(task);

    return new ApiResponse(response);
  }

  async remove(id: string, userId: any):Promise<ApiResponse>  {
    const found = await this.findById(id);
    if(found.userId != userId){
      throw new UnauthorizedException("You can only delete your own task")
    }
    await this.taskRepository.remove(found);
    return new ApiResponse();
  }
}
