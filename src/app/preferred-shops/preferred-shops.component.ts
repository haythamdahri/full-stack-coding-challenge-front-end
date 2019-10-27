import {Component, OnDestroy, OnInit} from '@angular/core';
import {Shop} from '../models/shop.model';
import {Subscription} from 'rxjs';
import {ShopService} from '../shared/shop.service';
import {Title} from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preferred-shops',
  templateUrl: './preferred-shops.component.html',
  styleUrls: ['./preferred-shops.component.css']
})
export class PreferredShopsComponent implements OnInit, OnDestroy {

  /**
   * component properties
   */
  private shops: Array<Shop>;
  private shopsSubscription: Subscription;
  private shopSubscription: Subscription;
  private errorMode = false;
  private SHOP_IMAGE_PREFIX = 'http://localhost:8080/rest/v1/shop/image';

  /**
   * class constructor
   */
  constructor(private shopService: ShopService, private titleService: Title) {
  }

  /**
   * After application initialisation function
   */
  ngOnInit() {
    // Set component title
    this.titleService.setTitle('My Preferred Shops');
    // Set initial values
    this.shops = null;
    this.errorMode = false;
    // Set shops subscription
    this.shopsSubscription = this.shopService.getUserPreferredShops().subscribe(
      (shops: Array<Shop>) => {
        this.shops = shops;
      },
      error => {
        this.errorMode = true;
        this.shops = null;
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
  }

  /**
   * On shop like function
   */
  onShopRemove(id: number) {
    const btn = document.getElementById(`removeShopBtn${id}`);
    const originalContent = btn.innerHTML;
    // Add loading on button click
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Removing';
    (btn as HTMLButtonElement).disabled = true;
    // Call service function
    this.shopSubscription = this.shopService.removePreferredShop(id).subscribe(
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

}
