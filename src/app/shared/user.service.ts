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

  private static SIGN_UP_ENDPOINT = 'http://localhost:8080/rest/v1/save-user';
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


  handleHttpError(error) {
    return throwError(error);
  }
}
