import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@app/auth/services/auth';

export const accessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUser();

  if (
    currentUser?.isAdmin ||
    currentUser?.access.find(
      (accessPath: string) => accessPath === '/' + route.routeConfig?.path
    )
  ) {
    return true;
  }

  return false;
};