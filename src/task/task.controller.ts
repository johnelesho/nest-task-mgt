import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { TASK_PAGINATE_CONFIG } from '../constants';
import { ApiResponse } from '../ApiResponse';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { TaskStatus } from './enums/task-status';
import { UserRole } from '../users/enums/user-role';
import { Role } from '../role.decorator';

@Controller('task')
@ApiTags('Task Management')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: Request,
  ): Promise<ApiResponse> {
    const userId = request.user['sub'];
    return this.taskService.create(createTaskDto, userId);
  }

  @Get()
  @Role(UserRole.ADMIN)
  @ApiPaginationQuery(TASK_PAGINATE_CONFIG)
  async findAll(@Paginate() query: PaginateQuery): Promise<ApiResponse> {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    return this.taskService.findOne(id);
  }
  @Put(':id/changeStatus')
  @ApiQuery({ name: 'status', enum: TaskStatus, enumName: 'TaskStatus' })
  async changeTaskStatus(
    @Param('id') id: string,
    @Query('status') status: TaskStatus,
    @Req() request: Request,
  ): Promise<ApiResponse> {
    const userId = request.user['sub'];
    return this.taskService.changeTaskStatus(id, status, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: Request,
  ): Promise<ApiResponse> {
    const userId = request.user['sub'];
    return this.taskService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<ApiResponse> {
    const userId = request.user['sub'];
    return await this.taskService.remove(id, userId);
  }
}
