import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        // If the controller already returned a formatted response, return it as is
        if (res && res.success !== undefined && res.message) {
          return res;
        }

        // Otherwise, wrap it in our standard success response format
        const responseData = res?.data !== undefined ? res.data : res;
        const meta = res?.meta;

        return {
          success: true,
          message: res?.message || 'Request successful',
          data: responseData,
          ...(meta && { meta }),
        };
      }),
    );
  }
}
