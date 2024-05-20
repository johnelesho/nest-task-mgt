import { IsAlpha, IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsAlpha()
  firstName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsAlpha()
  lastName: string;

  @IsBoolean()
  isActive: boolean;
}
