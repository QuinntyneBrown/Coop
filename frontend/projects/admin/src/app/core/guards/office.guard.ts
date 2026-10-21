import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** An office area: a member who types its address lands on the dashboard (L2-REQ-112, ADR 0016). */
export const officeGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).office$.pipe(
    map((office) => office || router.createUrlTree(['/dashboard'])),
  );
};
