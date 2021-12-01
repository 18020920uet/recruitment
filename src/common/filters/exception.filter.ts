import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';

import { ValidationExeption } from '@Common/exceptions/validation.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    console.log(exception);

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const message = exception.message;
      if (exception instanceof ValidationExeption) {
        return response.status(statusCode).json({
          errors: exception.validationErrors,
          message: message,
          statusCode: statusCode,
          status: 0,
        });
      } else {
        return response.status(statusCode).json({ statusCode: statusCode, message: message, status: 0 });
      }
    } else {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (exception as Error).message;

      const exceptionResponse = {
        timestamp: new Date().toISOString(),
        statusCode: statusCode,
        method: request.method,
        path: request.path,
        message: message,
        status: 0,
      };

      this.writeLogs(exceptionResponse, request);
      if (process.env.NODE_ENV == 'production') {
        return response.status(statusCode).json({
          message: 'Internal server error',
          statusCode: statusCode,
          status: 0,
        });
      } else {
        return response.status(statusCode).json(exceptionResponse);
      }
    }
  }

  writeLogs(exceptionResponse: any, request: Request) {
    const logDirectory = './logs';
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }

    const log = { ...exceptionResponse, request: request.body, ip: request.ip };

    fs.appendFile('logs/error.log', JSON.stringify(log) + '\n', { flag: 'a' }, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
