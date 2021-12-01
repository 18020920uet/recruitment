import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Response } from '@Shared/responses/default';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const mapResponse = (data: any) => {
      return {
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Success',
        status: 1,
        data: data,
      };
    };
    return next.handle().pipe(map((data) => mapResponse(data)));
  }
}
