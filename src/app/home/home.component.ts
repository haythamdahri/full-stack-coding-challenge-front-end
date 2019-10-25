import {Component, OnDestroy, OnInit} from '@angular/core';
import {Shop} from '../models/shop.model';
import {Subscription} from 'rxjs';
import {ShopService} from '../shared/shop.service';

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
  private shops: Array<Shop> = new Array<Shop>();
  private shopsSubscription: Subscription;
  private errorMode = false;

  /**
   * class constructor
   */
  constructor(private shopService: ShopService) {
  }

  /**
   * After application initialisation function
   */
  ngOnInit() {
    // Use the service class
    this.shopsSubscription = this.shopService.getUserNearByShops().subscribe(
      (shops: Array<Shop>) => {
        this.shops = shops;
      },
      error => {
        this.errorMode = true;
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
  }

}
