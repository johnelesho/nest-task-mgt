import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { UserRecordDbFilterMiddleware } from './user-record-db-filter.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TaskModule,
    CacheModule.register({
      max: 10,
      ttl: 3600,
      isGlobal: true,
    }),
    ConfigModule.forRoot(), // Load environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // Inject ConfigService to use environment variables
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'), // Get DB_HOST from environment, default to localhost
        port: +configService.get<number>('DB_PORT', 5400), // Get DB_PORT from environment, default to 5400
        username: configService.get('DB_USERNAME', 'niyo'), // Get DB_USERNAME from environment, default to niyo
        password: configService.get('DB_PASSWORD', 'niyo'), // Get DB_PASSWORD from environment, default to niyo
        database: configService.get('DB_DATABASE', 'taskdb'), // Get DB_DATABASE from environment, default to taskdb
        autoLoadEntities: configService.get<boolean>(
          'AUTO_LOAD_ENTITIES',
          true,
        ), // Get AUTO_LOAD_ENTITIES from environment, default to true
        synchronize: configService.get<boolean>('SYNCHRONIZE', true), // Get SYNCHRONIZE from environment, default to true
      }),
    }),
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserRecordDbFilterMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
