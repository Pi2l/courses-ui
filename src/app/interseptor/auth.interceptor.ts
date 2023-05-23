import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { UserAuthService } from '../service/user-auth.service';
import { environment } from '../environment';
import { UserToken } from '../model/UserToken';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userAuthService: UserAuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.userAuthService.getUser?.accessToken}` });    
    const newRequest = request.clone({ headers: headers });
    
    return next.handle(newRequest).pipe(
      tap({
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 403) {
            console.log('403 error');
            return this.handle403Error(request, next, error);
          }
          console.log('403 error else');
          return throwError(() => new Error(error));
        }
      })
    );
  }

  private handle403Error(request: HttpRequest<unknown>, next: HttpHandler, error: HttpErrorResponse) {

    return this.userAuthService.refreshToken().pipe(
      tap({
        next: (event) => {
          event = event as HttpResponse<any>;
          const userToken = event.body as UserToken;
          const newRequest = request.clone({ 
            headers: new HttpHeaders({ 'Authorization': `Bearer ${userToken.accessToken}` })
          });
          return next.handle(newRequest);
        },
        error: (e) => {
          this.userAuthService.logout();
          return throwError(() => new Error(e));
        },
        complete: () => { console.log('finalize'); }
      })
    );
  }
}
