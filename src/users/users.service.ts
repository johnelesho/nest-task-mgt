import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";

import { User } from "./entities/user.entity";
import { ApiResponse } from "../ApiResponse";
import { paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { USER_PAGINATE_CONFIG } from "../constants";
import { UserRole } from "./enums/user-role";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
    await this.seedUser();
  }

  async seedAdminUser() {
    const adminUserExists = await this.userRepository.findOne({ where: { username: 'admin' } });
    if (adminUserExists) return;
      const hashedPassword = await bcrypt.hash('admin', 10);
      const adminUser = this.userRepository.create({
        username: 'admin',
        firstName: 'Admin',
        lastName: 'admin',
        email: 'admin@niyo.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(adminUser);
      console.log('Admin user seeded successfully.');

  }
  async seedUser() {
    const userExists = await this.userRepository.findOne({ where: { username: 'user' } });
    if (userExists) return;
      const hashedPassword = await bcrypt.hash('user', 10);
      const adminUser = this.userRepository.create({
        username: 'user',
        firstName: 'user',
        lastName: 'user',
        email: 'user@niyo.com',
        password: hashedPassword,
        role: UserRole.USER,
      });
      await this.userRepository.save(adminUser);
      console.log(' User seeded successfully.');

  }
  async create(createUserDto: CreateUserDto): Promise<ApiResponse> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    let user = new User();
    user.username = createUserDto.username;
    user.password = hashedPassword;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.isActive = createUserDto.isActive;

    user = await this.userRepository.save(user);
     const {password, ...response } = user;
    return new ApiResponse(response);
  }
  async update(id: string, updateUserDto: UpdateUserDto, userId: string): Promise<ApiResponse> {
    const user = await this.findOne(id);
    if(user.id != userId){
      throw new UnauthorizedException("You can only make changes to your own details")
    }
    Object.assign(user, updateUserDto);
    const response = await this.userRepository.save(user);

    return new ApiResponse(response);
  }
  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return  await paginate(query, this.userRepository, USER_PAGINATE_CONFIG);
  }
  async findOne(id: string): Promise<User | null> {
   const user = await this.userRepository.findOneBy({ id });
   if(!user){
     throw new NotFoundException("User not found");
   }
    return user;
  }
  async deactivateUser(userId: string){
    let user = await this.findOne(userId);
    if(!user.isActive){
      throw new BadRequestException(`User status is already ${user.isActive}`)
    }
    user.isActive = false;

     user = await this.userRepository.save(user);
     const { tasks, ...response} = user;
     return new ApiResponse(response);
  }

  async activateReactivateUser(userId: string){
    let user = await this.findOne(userId);
    if(user.isActive){
      throw new BadRequestException(`User status is already ${user.isActive}`)
    }
    user.isActive = true;

     user = await this.userRepository.save(user);
     const { tasks, ...response} = user;
     return new ApiResponse(response);
  }
  async getUserWithDetails(
    username: string,
    email: string,
    sub: string,
  ): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(
        '(LOWER(user.username) = LOWER(:username) OR ' +
        'LOWER(user.email) = LOWER(:email)) AND user.id= :sub',
        { username, email, sub },
      )
      .getOne();
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByUsernameOrEmail(username: string, email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .select('*')
      .where(
        'LOWER(user.username) = LOWER(:username) OR ' +
        'LOWER(user.email) = LOWER(:email)',
        { username, email },
      )
      .getRawOne();
  }
}
