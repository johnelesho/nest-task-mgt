import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserRole } from "./users/enums/user-role";
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserRecordDbFilterMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {
  }
  use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const secret = this.configService.get<string>('JWT_SECRET');
        const user = jwt.verify(token, secret) as { username: string, role: string, sub: string }; // Decode JWT token

        if (user.role == UserRole.ADMIN) {
          return next();
        }
        console.log(req.query);
        req.query.filter = { ...req.query.filter, userId: user.sub };

      } catch (error) {
        // Invalid token or token verification failed
        console.error('Error verifying JWT token:', error);
      }
    }
    next();
  }
}
