import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((o) => !o.username || o.email)
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @ValidateIf((o) => !o.email || o.username)
  username: string;
}
