import { HttpService } from '@nestjs/axios';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiPathInterceptor implements NestInterceptor {
  constructor(
    private readonly httpService: HttpService,
    @Inject('BASE_URL') private readonly baseURL: string,
  ) {
    if (!baseURL) {
      throw new Error('BASE_URL is required but was not provided');
    }
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    this.httpService.axiosRef.defaults.baseURL = this.baseURL;
    this.httpService.axiosRef.defaults.headers.common['Content-Type'] =
      'application/json';

    return next.handle().pipe(
      tap({
        next: () => {
          this.httpService.axiosRef.defaults.baseURL = this.baseURL;
        },
        error: () => {
          this.httpService.axiosRef.defaults.baseURL = this.baseURL;
        },
      }),
    );
  }
}
