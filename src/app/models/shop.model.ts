import {User} from './user.model';

/**
 * Shop model class
 */
export class Shop {
  /**
   * Model properties
   */
  public id: number;
  public name: string;
  public image: string;
  public distance: number;
  public users: Array<User>;
}
