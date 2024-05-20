import { SetMetadata } from '@nestjs/common';
import { UserRole } from "./users/enums/user-role";

export const Role = (...roles: UserRole[]) => SetMetadata('role', roles);
