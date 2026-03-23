import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // If banned, block everything and logout
  if (auth.isBanned()) {
    // For EXPEDITEUR, they can log in but are blocked from dashboard.
    // We allow them to pass the guard but the components will show a ban message/block features.
    // This way they stay "logged in" as per requirement.
    if (auth.isExpéditeur()) {
      return true; 
    }
    
    auth.logout();
    router.navigate(['/auth/login'], { queryParams: { error: 'banned' } });
    return false;
  }

  // Transporter verification check
  if (auth.isTransporteur() && !auth.isVerified()) {
    auth.logout();
    router.navigate(['/auth/login'], { queryParams: { error: 'unverified' } });
    return false;
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return true;

  // Redirect to appropriate dashboard
  const role = auth.currentUser()?.role;
  if (role === 'ADMIN') {
    router.navigate(['/admin']);
  } else {
    router.navigate([role === 'TRANSPORTEUR' ? '/dashboard/transporter' : '/dashboard/sender']);
  }
  return false;
};
