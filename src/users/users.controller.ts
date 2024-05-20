import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { USER_PAGINATE_CONFIG } from '../constants';
import { ApiResponse } from '../ApiResponse';
import { Role } from '../role.decorator';
import { UserRole } from './enums/user-role';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('users')
@ApiTags('User Management')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipAuth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get()
  @Role(UserRole.ADMIN)
  @ApiPaginationQuery(USER_PAGINATE_CONFIG)
  async findAll(@Paginate() query: PaginateQuery): Promise<ApiResponse> {
    return new ApiResponse(await this.usersService.findAll(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    return new ApiResponse(await this.usersService.findOne(id));
  }
  @Get(':id/deactivate')
  @Role(UserRole.ADMIN)
  async deactivateUser(@Param('id') id: string): Promise<ApiResponse> {
    return new ApiResponse(await this.usersService.deactivateUser(id));
  }
  @Get(':id/activate')
  @Role(UserRole.ADMIN)
  async activateReactivateUser(@Param('id') id: string): Promise<ApiResponse> {
    return new ApiResponse(await this.usersService.activateReactivateUser(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const userId = request['user']['sub'];
    console.log(userId);
    return await this.usersService.update(id, updateUserDto, userId);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.usersService.remove(id);
  }
}
