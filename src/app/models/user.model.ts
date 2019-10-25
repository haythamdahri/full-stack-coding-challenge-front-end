import {Role} from './role.model';
import {Shop} from './shop.model';

/**
 * User model class
 */
export class User {
  /**
   * Model properties
   */
  public id: number;
  public username: string;
  public email: string;
  public password: string;
  public enabled: boolean;
  public image: string;
  public roles: Array<Role>;
  public preferredShops: Array<Shop>;
}
