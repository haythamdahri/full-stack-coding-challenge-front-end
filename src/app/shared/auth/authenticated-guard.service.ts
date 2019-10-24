import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

/**
 * AuthGuard service to prevent access to login or registering pages from authenticated users
 * Service is provided in root (Anywhere in the application)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

  /**
   * Class constructor
   */
  constructor(private authService: AuthService, private router: Router) {
  }

  /**
   * Implementing canAcitvate function
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
