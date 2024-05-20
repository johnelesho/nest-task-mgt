import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Simple Task Management API')
  .setDescription(
    `
        A RESTful API for a simple task management system with the following features
        User Authentication, CRUD Operations, Data Persistence, Input Validation
        `,
  )
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};
