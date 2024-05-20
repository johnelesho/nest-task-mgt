import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from 'bcryptjs';
import { ApiResponse } from "../ApiResponse";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const { username, email, password } = loginDto;
    const user = await this.userService.findByUsernameOrEmail(username, email);
    if (!user) throw new UnauthorizedException('Invalid Credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid Credentials');
    const payload = {
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      email: user.email,
      sub: user.id,
    };
    return new ApiResponse({
      access_token: this.jwtService.sign(payload),
    });
  }


}
