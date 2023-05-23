import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environment';
import { UserToken } from '../model/UserToken';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private userSubject: BehaviorSubject<UserToken | null>;
  public user: Observable<UserToken | null>;

  constructor(
    private router: Router, 
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject( JSON.parse(localStorage.getItem('userToken')!) );
    this.user = this.userSubject.asObservable();
  }

  public get getUser() {
    return this.userSubject.value;
  }

  public login(login: string, password: string) {
    return this.http
      .post<UserToken>(`${environment.BASE_URL}/login`, { login, password })
      .pipe( map( user => {
        this.updateUser(user, login);
        return user;
      } ));
  }

  public logout() {
    const params = new HttpParams().set( "refreshToken", this.getUser?.refreshToken!! );
    
    this.http
      .post(`${environment.BASE_URL}/logout`, null, { params: params })
      .subscribe({
        next: () => {
          localStorage.removeItem('userToken');
          this.userSubject.next(null);
          this.router.navigate(['/login']);
          console.log('Logout successful');
        },
        error: (e) => this.handleError(e),
      });
  }

  public getUserDetails() {
    return this.http.post(`${environment.BASE_URL}/v1/users/1`, null);
  }

  public updateUser(user: UserToken, login: string) {
    localStorage.setItem( 'userToken', JSON.stringify({ ...user, login: login }) );
    this.userSubject.next( user );
  }

  public refreshToken() {
    const params = new HttpParams().set( "refreshToken", this.getUser?.refreshToken!! );
    // const newRequest = new HttpRequest('POST', `${environment.BASE_URL}/refresh`, null, { params: params });
    console.log("refreshToken pipe")
    return this.http.post<any>(`${environment.BASE_URL}/refresh`, { params: params }).pipe(
      tap({
        next: (event) => {
          console.log("refreshToken success")
          event = event as HttpResponse<any>;
          const userToken = event.body as UserToken;
          this.updateUser(userToken, this.getUser?.login!!);
        },
        error: (e) => {
          console.log("refreshToken error")
        },
        complete: () => { console.log('finalize'); }
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
