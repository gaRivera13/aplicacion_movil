import { CanActivateFn } from '@angular/router';

export const misDatosGuard: CanActivateFn = (route, state) => {
  return true;
};
