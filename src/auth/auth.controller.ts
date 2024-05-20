import { Body, Controller, Get, HttpCode, Request, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtGuard } from "./jwt.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SkipAuth } from "./skip-auth.decorator";

@Controller('auth')
@ApiTags("Authentication Management")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @SkipAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
