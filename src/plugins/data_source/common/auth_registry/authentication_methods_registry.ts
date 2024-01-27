/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// eslint-disable-next-line @osd/eslint/no-restricted-paths
import { DataSourceCredentialsProvider } from '../../server/types';

export type IAuthenticationMethodRegistery = Omit<
  AuthenticationMethodRegistery,
  'registerAuthenticationMethod'
>;

export class AuthenticationMethodRegistery {
  private readonly authMethods = new Map<string, DataSourceCredentialsProvider>();

  /**
   * Register a authMethods with function to return credentials inside the registry.
   * Authentication Method can only be registered once. subsequent calls with the same method name will throw an error.
   */
  public registerAuthenticationMethod(
    type: string,
    credentialProvider: DataSourceCredentialsProvider
  ) {
    if (this.authMethods.has(type)) {
      throw new Error(`Authentication method '${type}' is already registered`);
    }
    this.authMethods.set(type, credentialProvider);
  }

  public getAllAuthenticationMethods() {
    return [...this.authMethods.values()];
  }

  public getAuthenticationMethod(authType: string) {
    return this.authMethods.get(authType);
  }
}
