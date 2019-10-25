import {AuthService} from './auth/auth.service';
import {catchError, map, retry} from 'rxjs/operators';
import {User} from '../models/user.model';
import {HttpClient, HttpEventType, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';

/**
 * UserService class
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static API_ENDPOINT = 'http://localhost:8080/api';
  private static API_V1_ENDPOINT = 'http://localhost:8080/api/v1';
  private static SIGN_UP_ENDPOINT = 'http://localhost:8080/rest/users';
  private static ACTIVATION_ACCOUNT_ENDPOINT = 'http://localhost:8080/api/v1/activate-account';
  private static UPDATE_EMAIL_ENDPOINT = 'http://localhost:8080/api/v1/update-email';
  private static PERFORM_PASSWORD_RESET_ENDPOINT = 'http://localhost:8080/api/v1/perform-reset-password';
  private static USER_DETAILS_API_ENDPOINT = 'http://localhost:8080/api/users/search/findByEmail';
  public static USERS_IMAGE_PREFIX = 'http://localhost:8080/uploads/users/images';

  /**
   * class constructor
   */
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  /**
   * register a new user function
   */
  register(user: User) {
    return this.http.post<User>(UserService.SIGN_UP_ENDPOINT, user).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      map((user) => {
          return user;
        },
        catchError(this.handleHttpError)
      )
    );
  }

  activateAccount(token: string) {
    return this.http.get<{ status: boolean, message: string }>(`${UserService.ACTIVATION_ACCOUNT_ENDPOINT}/${token}`).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ status: boolean, message: string }>(`${UserService.PERFORM_PASSWORD_RESET_ENDPOINT}`, {
      token,
      newPassword
    }).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }


  getAuthenticatedUserDetails() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<User>(`${UserService.USER_DETAILS_API_ENDPOINT}`,
      {
        params: new HttpParams().append('email', this.authService.getAuthenticatedUser().email)
      }).pipe(
      map((data) => {
        data.image = UserService.USERS_IMAGE_PREFIX + '/' + data.image;
        return data;
      }),
      retry(5),
      catchError(this.handleHttpError)
    );
  }


  saveUser(username: string, location: string, userId: number) {
    return this.http.patch<User>(`${UserService.API_ENDPOINT}/users/${userId}`, {username, location}).pipe(
      catchError(this.handleHttpError)
    );
  }

  updateUserEmail(email: string) {
    return this.http.post<{ status: boolean, message: string }>(`${UserService.UPDATE_EMAIL_ENDPOINT}`,
      new HttpParams().append('email', email)).pipe(
      map((data) => {
        return data;
      }),
      catchError(this.handleHttpError)
    );
  }

  handleHttpError(error) {
    return throwError(error);
  }
}
