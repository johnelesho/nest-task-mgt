import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { ApiResponse } from "../ApiResponse";

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: T, host: ArgumentsHost) {
    this.logger.error('Application Error ...', exception);
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // const status = exception.();
    const res = new ApiResponse('Internal Server Error', false);

    // response.status(HttpStatus.CONFLICT).json({
    //   // statusCode: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });
    response.status(HttpStatus.CONFLICT).json({
      ...res,
    });
  }

}
