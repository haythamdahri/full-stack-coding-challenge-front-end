import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Shop} from '../models/shop.model';

/**
 * Shop service class
 */
@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private static NEAR_BY_SHOPS = 'http://localhost:8080/rest/v1/near-by-shops';

  /**
   * constructor service class
   */
  constructor(private http: HttpClient) {
  }

  /**
   *
   */
  getUserNearByShops() {
    return this.http.get<Array<Shop>>(ShopService.NEAR_BY_SHOPS)
      .pipe(
        catchError(this.handleHttpError)
      );
  }

  handleHttpError(error) {
    return throwError(error);
  }
}
