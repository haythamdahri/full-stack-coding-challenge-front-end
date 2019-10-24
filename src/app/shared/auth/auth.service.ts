import {UserToken} from '../../models/user-token.model';
import {catchError, map, retry} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import {throwError} from 'rxjs';

/**
 * Authentication service that provides necessary function for checking, log in and log out
 * Service is provided in root (Anywhere in the application)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * static properties
   */
  private static API = 'http://localhost:8080';
  private static EMAIL_CHECK_ENDPOINT = 'http://localhost:8080/rest/users/search/existsByEmail';

  /**
   * Class constructor
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Check expiration date function
   * @returns Boolean
   */
  isValidToken(expiration: number) {
    const now = new Date().getTime();
    return expiration > now;
  }

  /**
   * Check if user is authenticated function
   * @returns Boolean
   */
  isAuthenticated() {
    const userToken: UserToken = JSON.parse(localStorage.getItem('userToken'));
    // Checking expiration and email
    if (userToken != null && this.isValidToken(userToken.exp)) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  /**
   * Get current user function
   * @returns UserToken object
   */
  getAuthenticatedUser() {
    const userToken: UserToken = JSON.parse(localStorage.getItem('userToken'));
    if (userToken != null) {
      return userToken;
    } else {
      return null;
    }
  }

  /**
   * Login into internal system function
   * @returns Observable of type object
   */
  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${AuthService.API}/authenticate`, {
        email,
        password
      })
      .pipe(
        map(userData => {
          const userToken = this.decodeToken(userData.token);
          localStorage.setItem('userToken', JSON.stringify(userToken));
          return userToken;
        })
      );
  }

  /**
   * Logout from the system function
   */
  logout() {
    localStorage.clear();
  }

  /**
   * Check if user has role function
   * @returns Boolean
   */
  async hasRole(roleName: string) {
    const userToken: UserToken = JSON.parse(localStorage.getItem('userToken'));
    return (
      userToken.roles.find(role => role.authority === roleName) != null
    );
  }

  /**
   * Check if connected user is an admin function
   * @returns Boolean
   */
  isAdmin() {
    const userToken: UserToken = JSON.parse(localStorage.getItem('userToken'));
    return (
      userToken.roles.find(role => role.authority === 'ROLE_ADMIN') != null
    );
  }

  /**
   * Decode token function
   * @returns UserToken object
   */
  decodeToken(token: string) {
    const decoded = jwtDecode(token);
    const userToken = new UserToken();
    userToken.bearerToken = 'Bearer ' + token;
    userToken.token = token;
    userToken.email = decoded.sub;
    userToken.roles = decoded.roles;
    userToken.exp = Number(decoded.exp * 1000);
    return userToken;
  }

  /**
   * Check if the email is already used function
   * @returns Observable of type boolean
   */
  checkEmailValidity(email: string) {
    return this.http.get<boolean>(AuthService.EMAIL_CHECK_ENDPOINT, {params: new HttpParams().append('email', email)}).pipe(
      map((exists) => {
        if (exists) {
          if (!this.isAuthenticated()) {
            return {isEmailAlreadyUsed: exists};
          } else {
            if (this.getAuthenticatedUser().email !== email) {
              return {isEmailAlreadyUsed: exists};
            } else {
              return null;
            }
          }
        } else {
          return null;
        }
      }),
      retry(3),
      catchError(this.handleEmailValidityError)
    );
  }

  /**
   * Check if the email exists function
   * @returns Observable of type boolean
   */
  checkEmailExisting(email: string) {
    return this.http.get<boolean>(AuthService.EMAIL_CHECK_ENDPOINT, {params: new HttpParams().append('email', email)}).pipe(
      map((exists) => {
        if (exists) {
          return null;
        } else {
          return {isEmailDoesNotExist: true};
        }
      }),
      retry(3),
      catchError(this.handleEmailValidityError)
    );
  }

  /**
   * Handle Email validity error function
   */
  handleEmailValidityError(error) {
    return throwError(error);
  }
}
