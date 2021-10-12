import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from "fs";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const statusCode =  exception.getStatus();
      const message = exception.message;

      const exceptionResponse = {
        statusCode: statusCode,
        message: message,
        status: 0
      };

      return response.status(statusCode).json(exceptionResponse);
    } else {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (exception as Error).message;

      const exceptionResponse = {
        statusCode: statusCode,
        status: 0,
        message: message,
        path: request.path,
        method: request.method,
        timestamp: new Date().toISOString()
      };

      const logDirectory = './logs';
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
      }

      const log = {
         ... exceptionResponse,
         request: request.body,
         ip: request.ip,
      };

      fs.appendFile(
        'logs/error.log',
        JSON.stringify(log) + '\n',
        { flag: 'a' },
        (err) => {
          if (err) {
            throw err;
          }
          console.log('Internal server error has been saved!');
        }
      );

      if (process.env.NODE_ENV == 'production') {
        return response.status(statusCode).json({
          statusCode: statusCode,
          message: 'Internal server error',
          status: 0
        });
      } else {
        return  response.status(statusCode).json(exceptionResponse);
      }
    }
  }
}
