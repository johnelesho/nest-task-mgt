import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from "@nestjs/swagger";
import { swaggerConfig, swaggerOptions } from "./swagger-doc";
import { ValidationPipe } from "@nestjs/common";
import { DatabaseExceptionFilter } from "./filters/database-exception.filter";
import { GlobalExceptionFilter } from "./filters/global-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(
    // new GlobalExceptionFilter(),
    new DatabaseExceptionFilter(),
  );
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );

  SwaggerModule.setup('docs', app, swaggerDocument);
  await app.listen(5000);
}
bootstrap();
