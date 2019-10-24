import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

/**
 * RequestInterceptor service to intercept any sent request for the objective of adding Authorization header
 * Service is provided in root (Anywhere in the application)
 */
@Injectable({
  providedIn: 'root'
})
export class RequestInterceptor implements HttpInterceptor {

  /**
   * Class constructor
   */
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  /**
   * Implementing intercept function
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve connected user info
    const userToken = this.authService.getAuthenticatedUser();
    if (this.authService.isAuthenticated() && userToken != null && userToken.bearerToken != null) {
      req = req.clone({
        setHeaders: {
          Authorization: userToken.bearerToken
        }
      });
    }
    // Forward request handling
    return next.handle(req);
  }
}
