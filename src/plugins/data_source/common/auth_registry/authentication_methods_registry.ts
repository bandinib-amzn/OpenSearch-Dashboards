/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthMethodValues } from '../../server/types';

export type IAuthenticationMethodRegistery = Omit<
  AuthenticationMethodRegistery,
  'registerAuthenticationMethod'
>;

export class AuthenticationMethodRegistery {
  private readonly authMethods = new Map<string, AuthMethodValues>();
  /**
   * Register a authMethods with function to return credentials inside the registry.
   * Authentication Method can only be registered once. subsequent calls with the same method name will throw an error.
   */
  public registerAuthenticationMethod(type: string, authMethodValues: AuthMethodValues) {
    if (this.authMethods.has(type)) {
      throw new Error(`Authentication method '${type}' is already registered`);
    }
    this.authMethods.set(type, authMethodValues);
  }

  public getAllAuthenticationMethods() {
    return [...this.authMethods.values()];
  }

  public getAuthenticationMethod(authType: string) {
    return this.authMethods.get(authType);
  }
}
