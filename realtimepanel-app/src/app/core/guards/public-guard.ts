import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth';
import { AuthStatus } from '@app/data/enums/auth-status';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if ( authService.authStatus() === AuthStatus.authenticated) {
    router.navigate(['']);
    return false;
  }

  return true;
};
