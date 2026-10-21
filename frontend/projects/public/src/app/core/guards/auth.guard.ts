import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { adminLoginGuard } from './admin-login.guard';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (authService.isAuthenticated) {
    return true;
  }

  return adminLoginGuard(route, state);
};
