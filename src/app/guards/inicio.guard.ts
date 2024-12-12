import { CanActivateFn } from '@angular/router';

export const inicioGuard: CanActivateFn = (route, state) => {
  return true;
};
