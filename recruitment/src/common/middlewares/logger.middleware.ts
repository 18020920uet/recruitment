import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request;
    const startPoint = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      const delay = Date.now() - startPoint;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${delay}ms`,
      );
    })
    next();
  }
}
