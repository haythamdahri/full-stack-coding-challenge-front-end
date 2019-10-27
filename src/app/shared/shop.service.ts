import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
  private static USER_PREFERRED_SHOPS = 'http://localhost:8080/rest/v1/user-preferred-shops';
  private static ADD_SHOP_TO_USER = 'http://localhost:8080/rest/v1/add-user-shop';
  private static DISLIKE_SHOP = 'http://localhost:8080/rest/v1/dislike-shop';
  private static REMOVE_PREFERRED_SHOP = 'http://localhost:8080/rest/v1/remove-preferred-shop';

  /**
   * constructor service class
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Fetch api for user near shops function
   */
  getUserNearByShops(search: string) {
    // Create HttpParams object
    let params: HttpParams;
    // Check if search is not null
    if (search != null) {
      params = new HttpParams().set('search', search);
    }
    // Send http request and return the promise
    return this.http.get<Array<Shop>>(ShopService.NEAR_BY_SHOPS, {params})
      .pipe(
        catchError(this.handleHttpError)
      );
  }

  /**
   * Fetch api for user preferred shops function
   */
  getUserPreferredShops() {
    // Send http request and return the promise
    return this.http.get<Array<Shop>>(ShopService.USER_PREFERRED_SHOPS)
      .pipe(
        catchError(this.handleHttpError)
      );
  }

  /**
   * Add a shop to the user preferred shops service function
   */
  addShopToUserPreferredShops(id: number) {
    return this.http.post<{ status: boolean, message: string }>(`${ShopService.ADD_SHOP_TO_USER}/${id}`, {}).pipe(
      catchError(this.handleHttpError)
    );
  }

  /**
   * Dislike a shop service function
   */
  dislikeShop(id: number) {
    return this.http.post<{ status: boolean, message: string }>(`${ShopService.DISLIKE_SHOP}/${id}`, {}).pipe(
      catchError(this.handleHttpError)
    );
  }

  /**
   * Remove a preferred shop service function
   */
  removePreferredShop(id: number) {
    return this.http.post<{ status: boolean, message: string }>(`${ShopService.REMOVE_PREFERRED_SHOP}/${id}`, {}).pipe(
      catchError(this.handleHttpError)
    );
  }

  /**
   * Handle http errors service function
   */
  handleHttpError(error) {
    return throwError(error);
  }
}
