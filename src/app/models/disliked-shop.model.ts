import {User} from './user.model';
import {Shop} from './shop.model';

/**
 * DislikedShop model class
 */
export class DislikedShop {
  /**
   * Model properties
   */
  public id: number;
  public user: User;
  public shop: Shop;
  public date: Date;
}
