import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { User } from "./users/entities/user.entity";
import { Task } from "./task/entities/task.entity";

export const USER_PAGINATE_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['id', 'createdAt'],
    nullSort: 'last',
    defaultSortBy: [['createdAt', 'DESC']],
    searchableColumns: ['firstName', 'username', 'email', 'id'],
    filterableColumns: {
    username: [
      FilterOperator.EQ,
      FilterOperator.ILIKE,
      FilterOperator.CONTAINS,
    ],
      email: [FilterOperator.ILIKE, FilterOperator.CONTAINS],
      role: [FilterOperator.EQ],
  },
  maxLimit: 50,
}


export const TASK_PAGINATE_CONFIG : PaginateConfig<Task> ={
  sortableColumns: ['id', 'createdAt'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  select: ['title', 'description', 'status', 'userId'],
  filterableColumns: {
    title: [
      FilterOperator.EQ,
      FilterOperator.ILIKE,
      FilterOperator.CONTAINS,
    ],
    description: [FilterOperator.ILIKE, FilterOperator.CONTAINS],
    status: [FilterOperator.EQ],
    userId: [FilterOperator.EQ],
  },
}