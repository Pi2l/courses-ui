import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(
    private http: HttpClient
  ) { }

  public getUserDetailsByLogin(login?: string): Observable<any> {
    return this.http.get(`${environment.BASE_URL}/v1/users/`, { params: { filter: `login=${login}`} });
  }
}
