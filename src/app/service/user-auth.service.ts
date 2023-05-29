import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, switchMap, tap, throwError } from 'rxjs';
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

  public login(login: string, password: string): Observable<UserToken> {
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
          this.logoutUser();
        },
        error: (e) => {
          this.handleError(e);
          this.logoutUser();
        },
    });
  }

  private logoutUser() {
    localStorage.removeItem('userToken');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    console.log('Logout successful');
  }

  public updateUser(user: UserToken | null, login: string) {
    if (user !== null) {
      user.login = login;
      localStorage.setItem( 'userToken', JSON.stringify( user ) );
    } else {
      localStorage.removeItem( 'userToken' );
    }
    this.userSubject.next( user );
  }

  public refreshToken() {
    return this.http.post(`${environment.BASE_URL}/refresh`, {}, 
      { 
        params: {
          refreshToken: this.getUser?.refreshToken!!
        } 
      })
      .pipe(
      tap( (res: any) => {
        this.updateUser(res, this.getUser?.login!!);
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
