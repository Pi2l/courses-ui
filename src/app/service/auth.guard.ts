import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserAuthService);
  const router = inject(Router);

  if ( authService.getUser !== null ) {
    return true;
  }
  
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
