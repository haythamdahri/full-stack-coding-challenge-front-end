import { User } from './user.model';
import { RoleType } from './role-type.enum';

/**
 * Role model class
 */
export class Role {
  /**
   * Model properties
   */
    id: number;
    roleName: RoleType;
    users: Array<User>;
}
