import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Если пользователь вошел то пускаем его далее
  if (authService.getUser()) {
    return true;
  }

  // Если нет -> отправляем на логин
  return router.createUrlTree(['/login']);
};