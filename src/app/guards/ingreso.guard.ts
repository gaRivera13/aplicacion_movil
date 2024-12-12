import { CanActivateFn } from '@angular/router';

export const ingresoGuard: CanActivateFn = (route, state) => {
  return true;
};
