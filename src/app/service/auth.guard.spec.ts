import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { UserAuthService } from './user-auth.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user is logged in', () => {
    const router = TestBed.inject(Router);
    const authService = TestBed.inject(UserAuthService);
  
    const getUserValue = spyOnProperty(authService, 'getUser')
      .and.returnValue({ 
        login: "login1",
        accessToken: "testAccessToken",
        refreshToken: "testRefreshToken",
        accessTokenLifetimeMinutes: 1,
        refreshTokenLifetimeMinutes: 10 
      });
    const routerNavigate = spyOn(router, 'navigate');

    const result = executeGuard(null as unknown as ActivatedRouteSnapshot, null as unknown as RouterStateSnapshot);

    expect(result).toBeTrue();
    expect(getUserValue).toHaveBeenCalled();
    expect(routerNavigate).not.toHaveBeenCalled();
  });

  it('should return false if user is NOT logged in', () => {
    const router = TestBed.inject(Router);
    const authService = TestBed.inject(UserAuthService);
  
    const getUserValue = spyOnProperty(authService, 'getUser')
      .and.returnValue( null );
    const routerNavigate = spyOn(router, 'navigate');

    const result = executeGuard(null as unknown as ActivatedRouteSnapshot, {
      url: "/redirectUrl",
      root: new ActivatedRouteSnapshot
    } );

    expect(result).toBeFalse();
    expect(getUserValue).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledOnceWith(['/login'], { queryParams: { returnUrl: "/redirectUrl" } });
  });
});
