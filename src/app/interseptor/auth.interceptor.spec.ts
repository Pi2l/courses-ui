import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserAuthService } from '../service/user-auth.service';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockAuthService: UserAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        UserAuthService, 
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
        ],
      imports: [
        HttpClientTestingModule,
      ]})

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(UserAuthService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should set authorization header to request', () => {
    const url = 'http://localhost:8080/api/v1/users/1';
    
    spyOnProperty(mockAuthService, 'getUser').and.returnValue({ 
      login: "login1",
      accessToken: "testAccessToken",
      refreshToken: "testRefreshToken",
      accessTokenLifetimeMinutes: 1,
      refreshTokenLifetimeMinutes: 10 
    });

    httpClient.get(url).subscribe();

    const httpRequest = httpTestingController.expectOne(url);
    const authHeader = httpRequest.request.headers.get('Authorization');
    console.log(authHeader);
    
    expect(authHeader).toBeTruthy();
    expect(authHeader).toEqual(`Bearer ${mockAuthService.getUser?.accessToken}`);
    
    httpRequest.flush( null );
  });

  it('should send new request with new access token when old token is expired', () => {    
    const userToken = {
      login: "login1",
      accessToken: "expiredAccessToken",
      refreshToken: "testRefreshToken",
      accessTokenLifetimeMinutes: 1,
      refreshTokenLifetimeMinutes: 10 
    };
    spyOnProperty(mockAuthService, 'getUser').and.returnValue(userToken);
    
    const url = 'http://localhost:8080/api/v1/users/1';
    const refreshUrl = `http://localhost:8080/api/refresh?refreshToken=${mockAuthService.getUser?.refreshToken}`;

    httpClient.get(url).subscribe();
    const httpRequest = httpTestingController.expectOne(url);
    httpRequest.error( new ProgressEvent('Bad Request'), { status: 403, statusText: 'Bad Request' } );

    const newUserToken = { ...userToken, accessToken: "newAccessToken" }
    const httpRequestRefresh = httpTestingController.expectOne(refreshUrl);
    httpRequestRefresh.flush( newUserToken );

    httpClient.get(url).subscribe();
    const httpRequestResent = httpTestingController.match(url)[0];
    const authHeaderResent = httpRequestResent.request.headers.get('Authorization');

    expect(authHeaderResent).toBeTruthy();
    expect(authHeaderResent).toEqual(`Bearer ${newUserToken.accessToken}`);
    httpRequestResent.flush( null );
  });

  it('should return error when refresh and access token is expired', (done: DoneFn) => {    
    const userToken = {
      login: "login1",
      accessToken: "expiredAccessToken",
      refreshToken: "expiredRefreshToken",
      accessTokenLifetimeMinutes: 1,
      refreshTokenLifetimeMinutes: 10 
    };
    spyOnProperty(mockAuthService, 'getUser').and.returnValue(userToken);
    
    const url = 'http://localhost:8080/api/v1/users/1';
    const refreshUrl = `http://localhost:8080/api/refresh?refreshToken=${mockAuthService.getUser?.refreshToken}`;

    httpClient.get(url).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.error.message).toEqual( 'Token expired' )
        done()
      }
    });
    const httpRequest = httpTestingController.expectOne(url);
    httpRequest.error( new ProgressEvent('Bad Request'), { status: 403, statusText: 'Bad Request' } );

    const httpRequestRefresh = httpTestingController.expectOne(refreshUrl);
    httpRequestRefresh.flush( { message: 'Token expired' }, { status: 401, statusText: 'Bad Request' } );
    
    httpTestingController.expectNone(url);
  });
});
