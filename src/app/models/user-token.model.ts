/**
 * UserToken model class
 */
export class UserToken {
  /**
   * Model properties
   */
  bearerToken: string;
  token: string;
  email: string;
  roles: [{ authority: string }];
  exp: number;
}
