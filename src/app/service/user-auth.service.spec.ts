import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { environment } from '../environment';
import { UserToken } from '../model/UserToken';

import { UserAuthService } from './user-auth.service';

describe('UserService', () => {
  let service: UserAuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        UserAuthService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(UserAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user', (done: DoneFn) => {
    const mockResponse = {
      login: 'login',
      accessToken: 'testAccessToken',
      refreshToken: 'testRefreshToken',
      accessTokenLifetimeMinutes: 1,
      refreshTokenLifetimeMinutes: 10,
    };
    httpClientSpy.post.and.returnValue(
      of<UserToken>( mockResponse )
    );

    const mockUser = { login: 'login', password: 'password' };
    expect(localStorage.removeItem('userToken'));

    service.login( mockUser.login, mockUser.password )
      .subscribe({
        next: userToken => {
          expect(userToken).toEqual(userToken);
          expect(localStorage.getItem('userToken')).toEqual( JSON.stringify( mockResponse ) );

          done();
        }, 
        error: (e) => done.fail(e)
      });

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      `${environment.BASE_URL}/login`,
      { login: mockUser.login, password: mockUser.password }
    );
  });

  it('should NOT login user', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue( throwError(() => new Error( '401' )) );

    const mockUser = { login: 'login', password: 'password' };

    service.login( mockUser.login, mockUser.password )
      .subscribe({
        next: userToken => {
          done.fail( JSON.stringify(userToken) );
        }, 
        error: () => done()
      });

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      `${environment.BASE_URL}/login`,
      { login: mockUser.login, password: mockUser.password }
    );
  });
});
