import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { UserAuthService } from '../service/user-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isRefreshingToken = false;

  constructor(
    private userAuthService: UserAuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = request.clone({ 
      headers: request.headers.set('Authorization', `Bearer ${this.userAuthService.getUser?.accessToken}`) 
    });

    return next.handle(req).pipe( catchError( (error: HttpErrorResponse) => {
      if (error.status === 403 && !this.isRefreshingToken) {
        this.isRefreshingToken = true;
        return this.handle403Error(request, next);
      }
      this.isRefreshingToken = false;
      return throwError(() => error);
    })
    );
  }

  private handle403Error(request: HttpRequest<unknown>, next: HttpHandler) {
    return this.userAuthService.refreshToken().pipe(
      switchMap( (res: any) => {
        const newRequest = request.clone({ 
          setHeaders: { Authorization: `Bearer ${res.accessToken}` }
        });
        return next.handle(newRequest);
      })
    );
  }
}
