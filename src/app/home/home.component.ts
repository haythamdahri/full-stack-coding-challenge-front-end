import {Component, OnDestroy, OnInit} from '@angular/core';
import {Shop} from '../models/shop.model';
import {Subscription} from 'rxjs';
import {ShopService} from '../shared/shop.service';
import Swal from 'sweetalert2';
import {ActivatedRoute, Params} from '@angular/router';

/**
 * Home component class
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  /**
   * component properties
   */
  private shops: Array<Shop>;
  private shopsSubscription: Subscription;
  private shopSubscription: Subscription;
  private routeSubscription: Subscription;
  private errorMode = false;
  private SHOP_IMAGE_PREFIX = 'http://localhost:8080/rest/v1/shop/image';

  /**
   * class constructor
   */
  constructor(private shopService: ShopService, private route: ActivatedRoute) {
  }

  /**
   * After application initialisation function
   */
  ngOnInit() {
    // Set initial values
    this.shops = null;
    this.errorMode = false;
    // Set route subscription
    this.routeSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        const search: string = params.search;
        // Call service function with http query param
        this.shopsSubscription = this.shopService.getUserNearByShops(search).subscribe(
          (shops: Array<Shop>) => {
            this.shops = shops;
          },
          error => {
            this.errorMode = true;
            this.shops = null;
          }
        );
      }
    );
  }

  /**
   * After application destroying function
   */
  ngOnDestroy(): void {
    // Unsubscribe from shopsSubscription to free memory for best performances
    if (this.shopsSubscription != null) {
      this.shopsSubscription.unsubscribe();
    }
    if (this.shopSubscription != null) {
      this.shopSubscription.unsubscribe();
    }
    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
  }

  /**
   * On shop like function
   */
  onShopLike(id: number) {
    const btn = document.getElementById(`likeBtn${id}`);
    const originalContent = btn.innerHTML;
    // Add loading on button click
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Like';
    (btn as HTMLButtonElement).disabled = true;
    // Call service function
    this.shopSubscription = this.shopService.addShopToUserPreferredShops(id).subscribe(
      (data: any) => {
        // In case  shop has been added
        if (data.status === true) {
          // Remove shop from list
          document.getElementById(`shop${id}`).remove();
          // Display success message that came from the server
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: data.message
          });
          // Fetch data again from the server
          this.ngOnInit();
        } else {
          // In status false
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: data.message
          });
          // Put original content on button
          btn.innerHTML = originalContent;
          (btn as HTMLButtonElement).disabled = false;
        }
      },
      error => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'An error occurred, please try again!'
        });
        // Put original content on button
        btn.innerHTML = originalContent;
        (btn as HTMLButtonElement).disabled = false;
      }
    );
  }

  /**
   * On shop dislike function
   */
  onShopDislike(id: number) {
    const btn = document.getElementById(`dislikeBtn${id}`);
    const originalContent = btn.innerHTML;
    // Add loading on button click
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Dislike';
    (btn as HTMLButtonElement).disabled = true;
    // Call service function
    this.shopSubscription = this.shopService.dislikeShop(id).subscribe(
      (data: any) => {
        // In case  shop has been added
        if (data.status === true) {
          // Remove shop from list
          document.getElementById(`dislikeBtn${id}`).remove();
          // Display success message that came from the server
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: data.message
          });
          // Fetch data again from the server
          this.ngOnInit();
        } else {
          // In status false
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: data.message
          });
          // Put original content on button
          btn.innerHTML = originalContent;
          (btn as HTMLButtonElement).disabled = false;
        }
      },
      error => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'An error occurred, please try again!'
        });
        // Put original content on button
        btn.innerHTML = originalContent;
        (btn as HTMLButtonElement).disabled = false;
      }
    );
  }
}
