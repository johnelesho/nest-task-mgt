import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { ApiResponse } from "../ApiResponse";

@Catch(QueryFailedError) // Catch specific database exceptions, adjust as needed
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    this.logger.error(
      'Database Error ...',
      exception.query,
      exception.parameters,
      exception.name,
      exception.message,
      exception.stack
    );

    const context = host.switchToHttp();
    const response = context.getResponse();

    let message = 'Internal Server Error';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.message.includes('unique constraint')) {
      message = 'Duplicate entry';
      statusCode = HttpStatus.BAD_REQUEST;
    }
    if (exception.message.includes('invalid input ')) {
      message = exception.message.split(':')[0];
      statusCode = HttpStatus.BAD_REQUEST;
    }
    if (exception.message.includes('uuid')) {
      message = 'Invalid User Information';
      statusCode = HttpStatus.BAD_REQUEST;
    }
    const res = new ApiResponse(message, false);

    response.status(statusCode).json({
      ...res,
    });
  }
}
