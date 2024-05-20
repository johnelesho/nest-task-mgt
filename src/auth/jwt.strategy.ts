import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private currentUserService: CurrentUserService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    let { username, email, sub } = payload;
    const user = await this.userService.getUserWithDetails(
      username,
      email,
      sub,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    // this.currentUserService.setUsername(username);
    return payload;
  }
}
