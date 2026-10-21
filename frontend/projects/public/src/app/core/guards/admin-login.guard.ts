import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ADMIN_LOGIN_URL } from '../services/admin-login-url';

/** Members sign in on the admin site: leave the app for its login screen (L2-REQ-101). */
export const adminLoginGuard: CanActivateFn = () => {
  inject(DOCUMENT).location.assign(ADMIN_LOGIN_URL);
  return false;
};
