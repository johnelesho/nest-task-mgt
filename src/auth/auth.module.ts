import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { CurrentUserService } from './current-user.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';
import { EntitySubscriber } from './entity-subscriber';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    AuthService,
    EntitySubscriber,
    JwtStrategy,
    CurrentUserService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get JWT_SECRET from environment
        global: true,
        signOptions: {
          expiresIn: configService.get<string>('JWT_TOKEN_EXPIRES_IN'),
        }, // Optional: Set token expiration
      }),
      inject: [ConfigService], // Inject ConfigService to use environment variables
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
